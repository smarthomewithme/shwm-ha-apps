# Smart Home With Me — master Facebook session

One account keeps its original `browser_profile` and cookies. All personal group operations use that profile; Pages remain Graph API resources and never acquire the browser broker.

## Ownership

The runtime enables `FacebookMasterSessionBroker` for the onboarding/master identity. `WORKER`, `DIAGNOSTICS` and `INTERACTIVE` are mutually exclusive. Conflicting operations return an explicit busy/waiting error; they do not start a second Chromium or wait indefinitely in a hidden queue. Profile ownership remains protected by BrowserManager, including path/symlink checks.

An operation lease is never released merely because its time budget elapsed: releasing a live Chromium profile could permit an overlapping process or duplicate submit. Ownership is released on task settlement. Shutdown closes contexts to cancel browser operations, with a bounded service deadline. If context closure cannot be confirmed, the profile remains locked and new launches fail closed until restart.

Unexpected context closure invalidates the last status and cannot promote a returned worker result to success. If an external submit may have happened, the result is ambiguous and not automatically retried. Waiting for manual intervention preserves campaign, actor, group, copy and history.

## Normal flow

CHECK LOGIN/CHECK SESSION uses the broker's exclusive automation page for a read-only strong verification. This also creates a well-defined page boundary for the existing short group verification lease; a sibling-only proof on `about:blank` cannot incorrectly seed that lease. Successful checks register the actor and save a metadata-only status cache. The normal single personal actor is selected automatically and USE ACTOR is hidden when no alternative exists.

Worker group targets reuse the headless context and automation page. Each target still runs its live group preflight. The publisher navigates directly to its group and rechecks origin/group immediately at the submit boundary. The execution gate performs a fresh strong session probe on a temporary page in the **same context**, then verifies the expected personal actor on the composer page. This critical check does not use the UI status cache. It does not switch identity.

After five minutes without work, Chromium closes. Activity resets the deadline; busy operations cannot be closed by an idle timer. Restart or idle closure retains the same profile directory/cookies. The cache remains an explicitly dated last verified status, not a current publication authorization.

## Manual login and Browser Console

OPEN LOGIN is an explicit action. It closes a warm idle headless context and opens headed Chromium on the same saved profile. While manual login owns that context, both workers and CHECK SESSION fail with `WAITING_FOR_INTERACTIVE_SESSION`. Finish Facebook login/checkpoint/2FA yourself, then use **FINISH LOGIN / CLOSE CONSOLE** in Browser Console or Campaign Module, followed by CHECK SESSION.

Closing the browser tab alone does not transfer ownership. The explicit finish button shuts down headed Chromium before automated headless work resumes. noVNC HTTP/WebSocket admission also requires an interactive owner; the existing trusted Home Assistant Ingress boundary remains in force. Port 6080 is not exposed on the host. Existing sockets cannot manipulate headless Chromium after the headed context is closed.

## Diagnostics and performance

The cached status API never contacts Facebook. It reports last verified time/actor/status and broker owner/state. Timings report cold/warm context startup, operation duration, gap between operations and total time. Login results include `session_probe_ms`; group inspections retain their pre-check, navigation, DOM, cookie continuity and session-evidence timings.

The container smoke measures real Chromium cold/warm operations on synthetic local pages, validates one launch for two operations, verifies the lock and waits for idle close. It does not measure live Facebook hydration or prove live publication performance. The exact timing JSON appears in the CircleCI release log. Warm reuse removes repeated startup cost, at the expense of keeping one Chromium context in RAM for up to five minutes. CPU/RAM and real Facebook verification latency require observation in Home Assistant.

## User validation

1. Update and CHECK LOGIN; confirm the expected personal account and dated session status.
2. CHECK SESSION in Campaign Module; it must reach the backend without Route not found.
3. If manual login is needed, OPEN LOGIN, complete Facebook's normal flow, FINISH LOGIN / CLOSE CONSOLE, then CHECK SESSION.
4. Check the same group twice; inspect timings and confirm one warm context. Group checks remain read-only.
5. Configure/connect Meta and select a Page using the separate Meta setup guide. TEST PAGE CONNECTION must not start Chromium.
6. Only when deliberately ready, approve and test **one** group target and **one** Page post yourself. Verify the expected destination/actor, captured result and no duplicate retry. No live post is made by automated tests.
