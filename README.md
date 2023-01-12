
# Ignite matrix

This repository contains the case "Ignite Matrix".

## Installation

To install the required packages simply run

```
yarn install;
```

To run this project locally you need to have PostgreSQL installed and a database running.

[install PostgreSQL](https://www.postgresql.org/download/).

Open then `.env` and replace the DATABASE_URL with:

```
DATABASE_URL=postgres://<yourusername>:<yourpassword>@localhost:5432/ignite-matrix
```

Then run the migrations to set up the database tables:

```
npx prisma migrate --dev
```

## Running the program

```
yarn dev
```

## Example data

[Example data](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f6842995-6068-45b3-8ba4-705e80c4faed/data.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230112%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230112T202708Z&X-Amz-Expires=86400&X-Amz-Signature=c29606839c596066fc728be35f2d6067ad94229dacaf6c5a43434287dc51868c&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22data.json%22&x-id=GetObject