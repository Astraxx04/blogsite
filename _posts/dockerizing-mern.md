---
title: "Dockerizing MERN Applications"
excerpt: "\"It's working on my system\" is a common phrase used by many programmers who encounter issues when trying to run their code on different machines. Docker is a tool that addresses this problem."
coverImage: "/assets/blog/dockerizing-mern/cover.png"
date: "2024-01-13T10:00:00.000Z"
author:
  name: Gagan S
  picture: "/assets/blog/authors/gagan_img1.jpeg"
ogImage:
  url: "/assets/blog/dockerizing-mern/cover.png"
---

---

"It's working on my system" is a common phrase used by many programmers who encounter issues when trying to run their code on different machines. Docker is a tool that addresses this problem.

---

## What is Docker?

Docker is an open-source software platform that comprises a set of tools designed to make it easier to create, deploy, and run applications in lightweight, portable, and self-sufficient containers. All applications and their dependencies are defined in a ``Dockerfile``, which is then used to build Docker images that define a Docker container. Doing this ensures that the application runs in any environment.

---

## Why use Docker?

Using Docker can help you ship your code faster and gives you control over your applications.

- **Portability:** Docker containers encapsulate applications and their dependencies, making them highly portable.
- **Isolation:** Containers provide a level of isolation for applications, preventing conflicts between dependencies and ensuring that changes to one part of an application do not affect others.
- **Efficiency:** Docker containers share the host operating system's kernel and only include the necessary components to run the application.
- **Versioning and Rollback:** Docker images can be versioned, allowing developers to roll back to previous versions if needed.
- **Support for Various Technologies:** Docker supports a wide range of programming languages, frameworks, and tools.

---

## Key Concepts

- **Containerization:** Docker enables containerization, which involves encapsulating an application and its dependencies into a container. Containers are isolated from each other and from the underlying system.

- **Images:** A Docker image is a lightweight, standalone, and executable package that includes everything needed to run a piece of software, including the code, runtime, libraries, and system tools. Images are used to create containers.

- **Containers:** A container is a runtime instance of a Docker image. It is a lightweight, isolated environment that runs applications and their dependencies. Containers share the host system's kernel but are otherwise isolated from each other.

- **Dockerfile:** A `Dockerfile` is a script that contains instructions for building a Docker image. It specifies the base image, adds application code, sets environment variables, and configures other aspects of the container.

- **Registry:** Docker images can be stored in registries, which are repositories for sharing and distributing images. Docker Hub is a popular public registry.

- **Compose:** Docker Compose is a tool for defining and running multi-container Docker applications. It allows you to define a multi-container application in a single file, specifying the services, networks, and volumes required.

---

## Creating a Docker Image

Suppose you have a directory named `frontend` which consists of all the React files used to run the client-side application. To run this application inside a container, you have to first create an image.

Navigate to the `frontend` directory and create a file named `Dockerfile`.

```yaml
FROM node:20

WORKDIR /app

COPY ./package*.json ./

RUN npm install 

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
```
### Let's understand each of the keywords in the 'Dockerfile'.

- **FROM:** Specifies the base image for the build. The new image is built upon an existing image, and the FROM instruction defines which base image to use. In our case, we are using node:20 as the base image.
- **WORKDIR:** It sets the working directory for the commands that follow it. In our case, all the commands will be executed inside the /app directory.
- **COPY:** Copies files or directories from the host machine to the container's filesystem. In our case, the package.json and package-lock.json files will be copied to the /app directory inside the image that will be created. The instruction COPY . . is used to copy the contents of the current directory (in the host machine, where the Docker build is initiated) into the /app directory in the image being created.
- **RUN:** Executes commands in the container during the image build process. It is commonly used to install dependencies, configure the environment, and perform other setup tasks. Here it is used to install all the packages and dependencies that are specified in the package.json file.
- **EXPOSE:** Informs Docker that the container will listen on the specified network ports at runtime. In our case, it will be listening on port 3000.
- **CMD:** The instructions specified here are executed when the container is run. In our case, npm run start is executed when the container starts up.

To tell Docker to construct this image, based on the instructions found in Dockerfile, we execute this command:

```bash
docker build . -t frontend-image
```

frontend-image is a tag given to the image so that it can be referenced easily. Let’s see if the image has been created by listing all the images using the command below:

```bash
docker images
```

Let’s now start a container based on this image:

```bash
docker run frontend-image
```

Perfect! We've now successfully created a Docker image and ran the code inside a container. To stop the container you can use the following command:

```bash
docker stop <container-id>
```

**Some additional commands:**

```bash 
docker ps
``` 
Lists all the containers that are currently up and running.

```bash
docker run -d -p 5000:5000 <image-name> 
```
-d runs the container in detached mode, meaning it runs in the background and -p specifies the port mapping between the host machine and the container. In this case, it maps port 5000 on the host machine to port 5000 inside the container.

```bash
docker logs <container-id>
``` 
It is used to fetch the logs of a running or stopped container.

If you have a .env file, make sure it is copied into the container when the image is being created. Alternatively, you can add the environment variables to the Dockerfile in this way, before CMD:
```bash 
ENV myEnvVar = value
```

Now repeat the same steps for the backend and you can successfully run the node backend inside a container.

![Terminal-Image](/assets/blog/dockerizing-mern/commands-terminal.jpeg)

---
## Dockerizing a MERN Application

One thing you might have noticed is that in the previous methods, we create the images separately and run them individually. This might become a tedious task if many containers have to be spun up and linked to each other. To ease this process, we use a docker-compose.yaml file.

In the root directory of your project, create a file called 'docker-compose.yaml'.

```yaml
version: '3'
services:
  frontend:
    build: ./frontend
    container_name: frontend-container
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - mern-network

  backend:
    build: ./backend
    container_name: backend-container
    restart: always
    ports:
      - "5000:5000"
    networks:
      - mern-network

  database:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - /Users/gagans/Documents/Docker/DBackup:/data/db
    networks:
      - mern-network

networks:
  mern-network:
    driver: bridge
```

### Let's break down the significance of each keyword within the 'docker-compose.yaml' file.

- **version**: This specifies the version of the Docker Compose file syntax being used. In this case, it's version 3.

- **services**: This section defines the various services (containers) that compose the application. In this case, `frontend`, `backend`, and `database`.

- **frontend**: This is a service for the frontend of the application.

- **backend**: This is a service for the backend of the application.

- **database**: This is a service for the MongoDB database.

- **build**: Specifies the path to the Dockerfile for building the frontend service.

- **container_name**: `frontend-container`: Assigns a specific name to the container.

- **ports**: Maps port 3000 on the host to port 3000 on the container. In case of the backend, it's 5000:5000, and for the MongoDB database, it's the default MongoDB port 27017:27017.

- **depends_on**: Specifies that this service depends on the `backend` service. It makes sure that the server specified here is spun up first before the dependent server is started.

- **networks**: Connects the service to the `mern-network`.

- **restart**: Specifies that the container should always restart unless explicitly stopped.

- **image**: Uses the official MongoDB image from Docker Hub.

- **volumes**: Mounts a local directory for persistent storage of MongoDB data.

- **networks**: This section defines the networks used by the services.

- **mern-network**: It allows containers within the same network to communicate with each other.

- **driver**: Specifies the network driver. In this case, it's the bridge driver, which is the default for user-defined networks.


### Note:

If you want to use the official mongo container you have to use `mongodb://<service name>:27017/<your-database-name>` as the mongo uri in the backend. If you're using mongo atlas then there is no need to create a mongo container as each time a container is created for the backend it establishes connection to the cloud database.

So once you create the docker-compose.yaml file you can start the containers by navigating to the directory where your docker-compose.yaml file is located and run:
```bash 
docker-compose up
```

To stop the containers, you can use:
```bash 
docker-compose down
```

![Code-Image](/assets/blog/dockerizing-mern/code.png)

---

With this you now know how to create images and containers for your MERN applications.

PS: Before running the containers, ensure that your laptop/PC has enough memory to run them. Otherwise, you might end up with a frozen black screen. 😅

To access the resources I've used, you can visit:
[Github Link](https://github.com/Astraxx04/Learning-Docker)

If you want to learn more about docker you can visit the following sites:

- [Getting started with Docker](https://blog.wemakedevs.org/getting-started-with-docker#heading-basic-commands)
- [Docker Docs](https://docs.docker.com)
- [Docker Tutorial](https://www.youtube.com/watch?v=17Bl31rlnRM)

Thankyou!

---