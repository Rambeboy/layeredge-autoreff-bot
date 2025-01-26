import axios, { AxiosResponse } from "axios";
import chalk from "chalk";
import Web3 from "web3";
import { logMessage } from "../utils/logger";
import { getProxyAgent } from "./proxy";

export class layerEdgeRefferal {
  private refCode: string;
  private proxy: string | null;
  private axiosConfig: any;
  private wallet: any;

  constructor(refCode: string, proxy: string | null = null) {
    this.refCode = refCode;
    this.proxy = proxy;
    this.axiosConfig = {
      ...(this.proxy && { httpsAgent: getProxyAgent(this.proxy) }),
      timeout: 60000,
    };
    const web3 = new Web3();
    this.wallet = web3.eth.accounts.create();
  }

  public getWallet(): any {
    return this.wallet;
  }

  async makeRequest(method: string, url: string, config: any = {}, retries: number = 3): Promise<AxiosResponse | null> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios({
          method,
          url,
          ...this.axiosConfig,
          ...config,
        });
        return response;
      } catch (error) {
        if (i === retries - 1) {
          logMessage(null, null, `Request failed: ${(error as any).message}`, "error");
          if (this.proxy) {
            logMessage(null, null, `Failed proxy: ${this.proxy}`, "error");
          }
          return null;
        }

        
        process.stdout.write(chalk.yellow(`Retrying... (${i + 1}/${retries})\r`));
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    return null;
  }


  async checkInvite(): Promise<boolean> {
    const inviteData = {
      invite_code: this.refCode,
    };
    const response = await this.makeRequest("post", "https://referral.layeredge.io/api/referral/verify-referral-code", {
      data: inviteData,
    });
  
    if (response && response.data && response.data.data.valid === true) {
      logMessage(null, null, "Invite Code Valid", "success");
      return true;
    } else {
      logMessage(null, null, "Failed to check invite", "error");
      return false;
    }
  }

  async regsiterWallet(): Promise<boolean> {
    const registeData = {
      walletAddress: this.wallet.address,
    };
  
    const response = await this.makeRequest("post", `https://referral.layeredge.io/api/referral/register-wallet/${this.refCode}`, {
      data: registeData,
    });
  
    if (response && response.data ) {
      logMessage(null, null, "Wallet succesfull register", "success");
      return true;
    } else {
      logMessage(null, null, "Failed Refferal", "error");
      return false;
    }
  }

  async connectNode(): Promise<boolean> {
    const timestamp = Date.now();
    const message = `Node activation request for ${this.wallet.address} at ${timestamp}`;
    const sign = this.wallet.sign(message).signature;
  
    const dataSign = {
      sign: sign,
      timestamp: timestamp,
    };
  
    const response = await this.makeRequest(
      "post",
      `https://referral.layeredge.io/api/light-node/node-action/${this.wallet.address}/start`,
      { data: dataSign }
    );

    if (response && response.data && response.data.message === 'node action executed successfully') {
      logMessage(null, null, "Connected Node", "success");
      return true;
    } else {
      logMessage(null, null, "Failed to connect Node", "error");
      return false;
    }
  }

  async cekNodeStatus():Promise<boolean> { 
    const response = await this.makeRequest("get", `https://referral.layeredge.io/api/light-node/node-status/${this.wallet.address}`);
    if (response && response.data && response.data.data.startTimestamp !== null) {
      logMessage(null, null, "Node Status Running", "success");
      return true;
    } else {
      logMessage(null, null, "Failed to check Node Status", "error");
      return false;
    }
  }
}