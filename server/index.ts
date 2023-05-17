// this file is responsible for starting the server, please delete comment on pr / code review 

import createApp from "./app";

const app = createApp();

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
