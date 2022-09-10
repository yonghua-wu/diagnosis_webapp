import TencentCosHttp, { BucketInfoModel } from "@/api/tenant/Cos";
import COS from "cos-js-sdk-v5";
export default class TencentCos {
  public tencentCosAwait: Promise<any[]>;
  public cos: COS | null = null;
  // private authInfo: CredentailModel | null = null;
  private bucketinfo: BucketInfoModel | null = null;
  private static _interface: TencentCos | null = null;
  constructor() {
    const p = [];
    const getAuthPromise = TencentCosHttp.getAuthorization().then((res) => {
      // this.authInfo = res;
      return res;
    });
    p.push(getAuthPromise);
    p.push(
      TencentCosHttp.getBucket().then((res) => {
        this.bucketinfo = res;
        return res;
      }),
    );
    this.cos = new COS({
      getAuthorization: function (options, callback) {
        getAuthPromise.then((res) => {
          const credentials = res.credentials;
          callback({
            TmpSecretId: credentials.tmpSecretId,
            TmpSecretKey: credentials.tmpSecretKey,
            SecurityToken: credentials.sessionToken,
            StartTime: res.startTime, // 时间戳，单位秒，如：1580000000
            ExpiredTime: res.expiredTime, // 时间戳，单位秒，如：1580000000
          });
        });
      },
    });
    this.tencentCosAwait = Promise.all(p);
  }
  // public static getInterface() {
  //   if (this._interface === null) {
  //     this._interface = new TencentCos();
  //   }
  //   return this._interface;
  // }
  public upload(
    fileName: string,
    fileObject: string | File | Blob,
    progress?: (percent: number) => void,
    callback?: (err: COS.CosError, data: COS.PutObjectResult) => void,
  ) {
    this.tencentCosAwait.then(() => {
      this.cos?.putObject(
        {
          Bucket: (this.bucketinfo as BucketInfoModel).bucketName /* 填入您自己的存储桶，必须字段 */,
          Region: (this.bucketinfo as BucketInfoModel).region /* 存储桶所在地域，例如ap-beijing，必须字段 */,
          Key: "web/" + fileName /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
          StorageClass: "STANDARD",
          Body: fileObject, // 上传文件对象
          onProgress: function (progressData) {
            progress?.(progressData.percent);
          },
        },
        function (err, data) {
          console.log(err || data);
          callback?.(err, data);
        },
      );
    });
  }
  public download(fileName: string) {
    this.tencentCosAwait.then(() => {
      this.cos?.getObject(
        {
          Bucket: (this.bucketinfo as BucketInfoModel).bucketName /* 填入您自己的存储桶，必须字段 */,
          Region: (this.bucketinfo as BucketInfoModel).region /* 存储桶所在地域，例如ap-beijing，必须字段 */,
          Key: fileName /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
        },
        function (err, data) {
          console.log(err || data.Body);
        },
      );
    });
  }
}

// export default TencentCos.getInterface();
