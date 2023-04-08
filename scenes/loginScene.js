import { Scene } from "phaser";
import axios from "axios";
import { width, height } from "./app";

class loginScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "loginScene" });
  }

  init() {}
  preload() {
    this.load.html("loginForm", "/html/loginForm.html");
  }
  create() {
    // adds the form
    const form = this.add
      .dom(width / 2, height / 2)
      .createFromCache("loginForm");
    form.parent.classList.add("centered-container");
    form.addListener("submit");
    form.on("submit", (e) => {
      e.preventDefault();
      const name = form.getChildByID("name-input");
      if (name.value == "") {
        // adds red highlight
        name.classList.add("bad-input");
      } else {
        // removes red highlight
        if (name.classList.contains("bad-input")) {
          name.classList.remove("bad-input");
        }
        // from database
        axios
          .get("/login", {
            params: {
              name: name.value,
            },
          })
          .then((res) => {
            // prints out the layer data
            const userData = res.data;
            console.log(userData);
            this.scene.start("mainMenuScene", userData);
          });
      }
    });
  }
  update(time, delta) {}
}

export default loginScene;
