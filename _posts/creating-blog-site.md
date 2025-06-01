---
title: "Creating a Simple Blog Site"
postKey: "post-4"
excerpt: "In this blog, we’ll explore how to create a simple yet powerful blog site using Next.js, leveraging its static generation capabilities and enhancing it with additional features like analytics and syntax highlighting."
coverImage: "/assets/blog/creating-blog-site/cover.png"
date: "2025-06-01T10:00:00.000Z"
author:
  name: Gagan S
  picture: "/assets/blog/authors/gagan_img1.jpeg"
ogImage:
  url: "/assets/blog/creating-blog-site/cover.png"
---

---

Creating your own blog site can be a great way to showcase your work, share your thoughts, or even start a side project. While I have some frontend development experience, I opted for a quicker route by utilizing Vercel's Next.js Blog Starter template available at [Next.js Blog Starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter). Here's a detailed walkthrough of how I built upon this starter template and added essential features like code syntax highlighting and analytics for views, likes, and dislikes.

### Getting Started

The Blog Starter template is an excellent base for a static blog site. It leverages **Next.js's Static Generation** to convert Markdown files into HTML pages. This ensures your blog performs well and offers a great experience to your readers. Here’s how the template operates:

1. **Markdown Files as Data Source**: Blog posts are written in Markdown, a lightweight markup language. The application uses `remark` and `remark-html` libraries to convert these Markdown files into HTML strings.
2. **Metadata Handling**: The `gray-matter` library parses the frontmatter of Markdown files, extracting useful metadata such as the title, author, publication date, and an excerpt for each post.
3. **Static Generation**: Next.js processes the Markdown content during build time. This means the blog pages are pre-rendered and ready to load instantly, enhancing both speed and SEO rankings.

### Important Dependencies

To build the blog and implement additional features, several essential dependencies were used:

1. **gray-matter**: A powerful library for parsing Markdown files and extracting metadata from the frontmatter. This is particularly useful for managing blog post metadata such as titles and publication dates.
2. **remark** and **remark-html**: These libraries convert Markdown content into HTML, allowing the blog to render Markdown posts as fully styled HTML pages.

### Customizing the Design

The starter template comes with basic CSS, which I customized to align with the aesthetics I wanted for my blog. The existing styles provided a great starting point, but by tweaking components and applying additional styles, I was able to give my site a unique and personal touch. If you’re building a blog, feel free to modify these styles to suit your preferences.

### Adding Code Syntax Highlighting

One limitation of the starter template is the lack of code syntax highlighting, which is essential for technical blogs. To address this, I integrated `rehype-highlight`, a plugin that enhances the visual appearance of code blocks within Markdown content. This makes the code snippets not only easier to read but also visually engaging, which is especially helpful for programming-related posts.

### Implementing Analytics for Likes and Views

To make the blog more interactive and to monitor user engagement, I incorporated functionality to track views, likes, and dislikes. Firebase was a natural choice for managing this data due to its scalability and ease of integration. Here’s an overview of how these analytics were implemented:

#### Tracking Views

When a user visits a blog post, the system first identifies the user’s IP address through an external service. For privacy, this IP address is hashed using a secure algorithm before storing it in Firebase. Each blog post document in Firebase includes a `visitedBy` array, which contains hashed IPs of visitors. If a hashed IP is not already in this array, the view count for the post is incremented, and the hash is added to the array. This ensures that each user is counted only once.

#### Recording Likes and Dislikes

To track likes and dislikes, the blog maintains separate arrays in Firebase for users who have liked (`likedBy`) or disliked (`unlikedBy`) a post. These arrays also store hashed IPs, ensuring user privacy. When a user clicks the like or dislike button, their action is recorded in Firebase, and the corresponding count is updated dynamically. The system also ensures that users can toggle between liking and disliking without causing inconsistencies in the data.

### Enhancing User Engagement

In addition to the features described above, you can further enhance your blog by adding a commenting system, social media sharing buttons, or even a subscription feature for regular updates. These features not only improve user engagement but also create a sense of community around your content.

Building a blog can seem daunting at first, but with tools like Next.js and Firebase, the process becomes much more approachable. By starting with a well-structured template and gradually adding features, you can create a blog that is both functional and uniquely yours. Whether you’re sharing your thoughts, documenting your learning journey, or showcasing your projects, a custom blog site is a fantastic platform to express yourself.

Thankyou!

---