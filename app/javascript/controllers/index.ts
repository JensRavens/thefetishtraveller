// Load all the controllers within this directory and all subdirectories.
// Controller files must be named *_controller.js.

import { Application } from 'stimulus';
import { definitionsFromContext } from 'stimulus/webpack-helpers';

const application = Application.start();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = (require as any).context(
  'controllers',
  true,
  /_controller\.ts$/
);
application.load(definitionsFromContext(context));
