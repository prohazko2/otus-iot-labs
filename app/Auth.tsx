import React from "react";
import { auth } from "./api";

export class Auth extends React.Component {
  state = {
    username: "",
    password: "",
  };

  async handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      await auth(this.state.username, this.state.password);

      location.reload();
    } catch (err) {
      alert(err.message);
    }
  }

  render() {
    return (
      <div className="auth">
        <form onSubmit={(event) => this.handleSubmit(event)}>
          <label>
            username:
            <input
              type="text"
              value={this.state.username}
              onChange={(event) =>
                this.setState({ username: event.target.value })
              }
            />
          </label>
          <label>
            password:
            <input
              type="password"
              value={this.state.password}
              onChange={(event) =>
                this.setState({ password: event.target.value })
              }
            />
          </label>
          <input type="submit" value="auth" />
        </form>
      </div>
    );
  }
}
