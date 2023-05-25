const btn = document.querySelector(".comment-btn");

const commentFormHandler = async (event) => {
  event.preventDefault();

  const comment_body = document
    .querySelector('textarea[name="comment-description"]')
    .value.trim();
  const post_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];
  if (description) {
    const response = await fetch("/api/comments/", {
      method: "POST",
      body: JSON.stringify({
        post_id,
        comment_body,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
};

btn.addEventListener("click", commentFormHandler);