import http from "./http";

interface TsSubCmds {
  cmdId: number;
  entityId: string;
  entityType: string;
  scope: string;
  unsubscribe: boolean;
}

export class TbConnect {
  private host = "iothub.seeingflow.com";
  private websocket: WebSocket | null = null;
  private token = "";
  private ready: Promise<any>;
  private eventMap: any;
  private static _interface: TbConnect | null = null;
  constructor(host = "iothub.seeingflow.com") {
    this.host = host;
    this.eventMap = {};
    this.ready = this.login().then(() => {
      return this.connectWebsocket(this.token);
    });
  }
  public static getInstance() {
    if (this._interface === null) {
      this._interface = new TbConnect();
    }
    return this._interface;
  }
  private login(username = "testadmin@seeingflow.com", password = "finger.2020") {
    return http
      .post(`https://${this.host}/api/auth/login`, {
        username,
        password,
      })
      .then((res: any) => {
        console.log(res.token);
        this.token = res.token;
      });
  }
  private connectWebsocket(token: string) {
    const websocket = (this.websocket = new WebSocket("wss://" + this.host + "/api/ws/plugins/telemetry?token=" + token));
    websocket.onmessage = (e) => this.onmessage(e);
    return new Promise((resolve) => {
      websocket.onopen = function () {
        resolve(websocket);
      };
    });
  }
  private onmessage(event: any) {
    const data = JSON.parse(event.data);
    // console.log(data);
    this.eventMap[data.subscriptionId](data);
  }
  public subscribe(data: TsSubCmds[], cb: (msg: any) => void) {
    data.forEach((item) => {
      this.eventMap[item.cmdId] = cb;
    });
    console.log(this.eventMap);
    this.ready.then(() => {
      const obj = {
        tsSubCmds: data,
      };
      this.websocket?.send(JSON.stringify(obj));
    });
  }
  public unsubscribe(data: TsSubCmds[]) {
    data.forEach((item) => {
      delete this.eventMap[item.cmdId];
    });
    this.ready.then(() => {
      const obj = {
        tsSubCmds: data.map((item) => {
          return {
            ...item,
            unsubscribe: true,
          };
        }),
      };
      this.websocket?.send(JSON.stringify(obj));
    });
  }
  public getDevices(page: number, pageSize: number) {
    return this.ready.then(() => {
      return http
        .get(`https://${this.host}/api/tenant/deviceInfos?pageSize=${pageSize}&page=${page}`, {
          headers: {
            "X-Authorization": "Bearer " + this.token,
          },
        })
        .then((res) => {
          return res;
        });
    });
  }
  public getSwitchStatus(id: string) {
    return this.ready.then(() =>
      http.post(
        `https://${this.host}/api/rpc/twoway/${id}`,
        {
          method: "getStatus",
          params: null,
          persistent: false,
          timeout: 500,
        },
        {
          headers: {
            "X-Authorization": "Bearer " + this.token,
          },
        },
      ),
    );
  }
  public setSwitchStatus(status: boolean, id: string, point: string) {
    return this.ready.then(() =>
      http.post(
        `https://${this.host}/api/rpc/twoway/${id}`,
        {
          method: "set_" + point,
          params: status,
          persistent: false,
          timeout: 10000,
        },
        {
          headers: {
            "X-Authorization": "Bearer " + this.token,
          },
        },
      ),
    );
  }
}

export default TbConnect.getInstance();
