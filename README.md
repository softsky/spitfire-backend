# spitfire-backend

##  Tasks

### Run tasks
There is an IPC listener in `backend/index.js` which takes an event from the FE.
We should invoke some function or a puppeteer scenario to perform a task there.

### Update a task status
Front End expects BE to emit events when a task status changes.

To perform it we should import app instance from the `backend/index.js` and call `updateTaskStatus` method.
Which takes `id` and `status` as arguments.
