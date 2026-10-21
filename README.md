# SSP Helper

This is a web app for Alexandria University, Faculty of Engineering SSP students. It tells you what courses you've met its prerequisites. That's all.
Navigate to [project page](https://louay-morsi.me/ssp_helper) to try it out.

## Who is this for?
* Students who failed one or more courses.
* Students who withdrawed a course or an entire term.
### Basically, if you're behind the proposed study plan of your department, this app is for you. Otherwise, you can exit as it's not of use to you.

## IMPORTANT DISCLAIMER! PLEASE READ!
1. This web app is NOT affiliated with Alexandria University by any means.
1. SSP Helper only shows you what courses you've met its prerequisites. That's all.
1. There might be errors with the output of this app. Please revise your options with your advisor prior to actual registration.
1. Be careful as sometimes the prerequisites of courses are changed without informing the students. So SSP Helper might not be updated to the latest changes yet. (This happened with both CAE and GPE departments)
1. Completing the prerequisites of a certain course doesn't mean you can register it. It might not open for registration after all.
1. Some courses are more important than others. The output of this app is NOT a recommendation. It Just shows you the possibilities.
1. If you encounter an error with the prerequisites (or a bug in general), you can:
   * [Create an issue](https://github.com/louay-hesham/ssp_helper/issues/new) in GitHub
   * Or [send me an email](mailto:louay.hesham@gmail.com?Subject=SSP%20Helper%20Bug)
   * Or contact me directly

## Development
Requires Node 22.22+, 24.15+ or 26+.

* `npm install`
* `npm start`: dev server at http://localhost:4200
* `npm run build`: production build into `dist/` (served from `/ssp_helper/`)
* `npm test`: unit tests (Vitest)
* `npm run deploy`: production build, then `cdk deploy` of the `SSPHelper` stack (see below)

## Infrastructure (`infra/`)
An AWS CDK app (TypeScript) for the `SSPHelper` stack in `eu-west-1`: the `Bylaws` DynamoDB table, the two Python Lambdas (`lambda/`), the `SspHelperApi` REST API (stage `prod`), `LambdaRole`, and the deployment of the built front-end into `s3://louay-morsi.me/ssp_helper/` (stale files are pruned inside that prefix only; the bucket itself belongs to the PersonalWebsite stack).

The stack was converted in place from the old SAM template, so logical IDs of existing resources are pinned in `infra/lib/ssp-helper-stack.ts`; keep them when editing. The API routes are defined by an inline Swagger body (as SAM generated them), not by separate resource constructs.

* `cd infra && npm install` once
* `npm run build` (repo root) before `cdk synth` / `cdk diff`, since the deployment reads `dist/`
* `npx cdk diff --processed` compares against the template after SAM's transform; plain `cdk diff` flags false replacements for the first conversion
* Lambda unit tests: `pip install -r lambda/requirements-dev.txt && python -m pytest lambda`
* The two Lambda log groups and the SES sender identity existed before CDK and were adopted with `cdk import`
