const Posts = Vue.component("posts", {
  template: `
                <div>
                    <div class = "row">
                        <div class="card my-3 mx-3 col-4" style="width: 18rem;" v-for="post in posts_data">
                            <div class="card-body">
                                <h5 class="card-title">{{post.title}}</h5>
                                <h6 class="card-subtitle mb-2 text-body-secondary">Post ID : {{post.id}}</h6>
                                <p class="card-text">{{post.description}}</p>

                                <!-- Button trigger modal -->
                                <button type="button" class="card-link" :data-bs-target="'#staticBackdrop' + post.id" data-bs-toggle="modal">
                                    Update Post
                                </button>

                                <!-- Modal -->
                                <div class="modal fade" :id="'staticBackdrop' + post.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="'staticBackdropLabel' + post.id" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" :id="'staticBackdropLabel' + post.id">Update Blog</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div class = "my-3">
                                                    <label> Enter Post Title : </label>
                                                    <input v-model = "title" type="text">
                                                </div>

                                                <div class = "my-3">
                                                    <label> Enter Post Description : </label>
                                                    <input v-model = "desc" type="text">
                                                </div>
                                            </div>
                                        <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" @click = "update_blog(post.id)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button @click="delete_blog(post.id)" class="card-link">Delete Post</button>
                    </div>
                </div>
            </div>
            
            <button @click = "trigger_celery_job"> Trigger a Celery Job </button>
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    Create Post
                    </button>

                    <!-- Modal -->
                    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Blog</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class = "my-3">
                                <label> Enter Post Title : </label>
                                <input v-model = "title" type="text">
                            </div>

                            <div class = "my-3">
                                <label> Enter Post Description : </label>
                                <input v-model = "desc" type="text">
                            </div>

                            <div class = "my-3">
                                <label> Enter Post Image : </label>
                                <input type="file" id="myFile" name="filename">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" @click = "addblog" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
    `,
  data: function () {
    return {
      posts_data: [],
      title: "",
      desc: "",
    };
  },
  methods: {
    addblog: function () {
      const data = { title: this.title, desc: this.desc };

      fetch("/createblog", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          fetch("/getallposts")
            .then((response) => response.json())
            .then((data) => {
              console.log("Data returned from the backend:", data);
              this.posts_data = data;
            });
          // this.$router.go(0)
          // this.$router.push("/posts")
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    update_blog: function (id) {
      const data = { title: this.title, desc: this.desc };

      fetch(`/updateblog/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          fetch("/getallposts")
            .then((response) => response.json())
            .then((data) => {
              console.log("Data returned from the backend:", data);
              this.posts_data = data;
            });
          // this.$router.go(0)
          // this.$router.push("/posts")
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    delete_blog: function (id) {
      fetch(`/deleteblog/${id}`)
        .then((r) => r.json())
        .then((d) => {
          console.log(d);
          fetch("/getallposts")
            .then((response) => response.json())
            .then((data) => {
              console.log("Data returned from the backend:", data);
              this.posts_data = data;
            });
        });
    },

    trigger_celery_job : function () {

      fetch("/trigger-celery-job").then(r => r.json()
      ).then(d => {
        console.log("Celery Task Details:", d);
        let interval = setInterval(() => {
          fetch(`/status/${d.Task_ID}`).then(r => r.json()
          ).then(d => {
              if (d.Task_State === "SUCCESS") {
                console.log("task finished")
                clearInterval(interval);
                window.location.href = "/download-file";
              }
              else {
                console.log("task still executing")
              }
          })
        }, 4000)
      })
    }

  },
  mounted: function () {
    document.title = "Blogs - Show Posts";

    fetch("/getallposts")
      .then((response) => response.json())
      .then((data) => {
        console.log("Data returned from the backend:", data);
        this.posts_data = data;
      });
  },
});

export default Posts;
