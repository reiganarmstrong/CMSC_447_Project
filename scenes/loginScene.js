import { Scene } from "phaser";
import axios from "axios";
import { width, height } from "./app";

class loginScene extends Scene {
  constructor(config) {
    super(config);
  }

  init() {}
  preload() {
    this.load.html("loginForm", "/html/loginForm.html");
  }
  create() {
    // adds the form
    const element = this.add
      .dom(width / 2 + 250, height / 2)
      .createFromCache("loginForm");
    element.addListener("submit");
    element.on("submit", (e) => {
      e.preventDefault();
      const name = element.getChildByID("name-input");
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
            console.log(res.data);
          });
      }
    });
  }
  update(time, delta) {}
}

export default loginScene;
