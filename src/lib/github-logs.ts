export type GithubRunContext = {
  logs: string;
  workflowYaml: string;
};

async function githubFetch(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

export async function getRunContext(runUrl: string): Promise<GithubRunContext> {
  const match = runUrl.match(
    /github\.com\/([^/]+)\/([^/]+)\/actions\/runs\/(\d+)/,
  );
  if (!match) return { logs: "URL do run inválida.", workflowYaml: "" };

  const [, owner, repo, runId] = match;
  const base = `https://api.github.com/repos/${owner}/${repo}`;

  let logs = "";
  let workflowYaml = "";

  const jobsRes = await githubFetch(`${base}/actions/runs/${runId}/jobs`);
  if (jobsRes.ok) {
    const jobsData = (await jobsRes.json()) as {
      jobs?: { id: number; conclusion: string }[];
    };
    const failedJob = jobsData.jobs?.find((j) => j.conclusion === "failure");
    if (failedJob) {
      const logRes = await githubFetch(`${base}/actions/jobs/${failedJob.id}/logs`);
      if (logRes.ok) {
        const raw = await logRes.text();
        logs = raw.split("\n").slice(-200).join("\n");
      }
    }
  }

  const runRes = await githubFetch(`${base}/actions/runs/${runId}`);
  if (runRes.ok) {
    const runData = (await runRes.json()) as { path?: string };
    const workflowPath = runData.path ?? "";
    if (workflowPath) {
      const yamlRes = await githubFetch(`${base}/contents/${workflowPath}`);
      if (yamlRes.ok) {
        const yamlData = (await yamlRes.json()) as { content?: string };
        if (yamlData.content) {
          workflowYaml = Buffer.from(yamlData.content, "base64").toString("utf8");
        }
      }
    }
  }

  return { logs: logs || "Logs não disponíveis.", workflowYaml };
}
