interface Prop {
  ogUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
}
const ServiceMeta = (prop: Prop) => {
  return (
    <>
      <meta
        property="og:url"
        content={'https://toiebavote.harusame.dev' + (prop.ogUrl ?? '')}
      />
      <meta
        property="twitter:url"
        content={'https://toiebavote.harusame.dev' + (prop.ogUrl ?? '')}
      />
      <meta property="og:type" content="article" />
      <meta
        property="og:title"
        content={prop.ogTitle ?? '連想投稿SNS！といえばボート'}
      />
      <meta
        property="og:description"
        content="といえばボートでは「OOといえばXX」といった連想を投稿・投票するできるSNSです。あなたの連想は多数派？少数派？"
      />
      <meta
        property="twitter:description"
        content="といえばボートは「OOといえばXX」といった連想を投稿・投票するできる連想投稿SNSです。あなたの連想は多数派？少数派？"
      />
      <meta property="og:site_name" content="連想投稿SNS！といえばボート" />
      <meta
        property="og:image"
        content="https://toiebavote.harusame.dev/_next/image?url=%2Flogo.png&w=1080&q=100"
      />
      <meta
        property="twitter:image"
        content="https://00f74ba44bb2a237c73a077f47c58149d2a01c6d37-apidata.googleusercontent.com/download/storage/v1/b/toiebavote.harusame.dev/o/images%2Fsite-cover.png?jk=AFshE3XAhfh4W5zn-gIgzRwGvB5HTpm2svVyt1jJ0CvqdgAp456Uq2X-CEwoTE847hD5L2uwC9oqQsIK3j2vXsAC184qE_liragmvA9rdCFq5uqZx2JwCnN3bOnp3KnDqkhxHXznV9K8bXFT4kAPQaWZwY_ziOkZt7paHPufktuFe4teOXeLCchq2114mnY6Qzpo2WbPdzLaWAgUZLCd4EKQJyUfQOxd6NfxWZoQmpNcrP9TAOdEpAU8d05N6spI0aHrwdEjtNoC4pAfHYyCd-zHwamwMI_7-hkHg_Es6jk81i8g5fCZsSdcun3otNYYlVT5MIHNyPd92RdAiJ5q8-D7fB2kDcgddahfrt4NaymARRpf0G-ERD6VuLSCMef8p8OfdfE-L1jAQEkv3GLVMZ4v3ZjCUYN0MhsxER54Aa-SBpegPieKlO4UjiokxxSgkRpoXzSfSg-zTRzni5tT5VdGoNu9JsN_GYLUQduCnr7z_MokJ0wbjlABN8-c4HwUUx66lhs0YMNvLP-iEBVandSBHpeB_LhnzF49AC8I2bwIDoDftP94cxIS9F7_illPaU_lKzrldEO33SLca7qhVl8vBtYFmShWOt08Al2Y4ziSiLy0zkmOAW9MxSeVhpz7TKU98t5W5ptCkUzfxRAMiWuhWx3dK9lTfndjajaZWrJK-XEw3_RpCClpN-Ve5TrVWeNiZASD0OnWQRbRv3hLblP6uoWQw9pxF_b6aenTMuFAucT-9soofgMyF0W23uXXoyrX24q5XItflcHnTu5hF3U_XtGpLhFFcVlF0fLFuwAAqhxSH_qAAURozaJeYM2I_BY83WZWHCx4E17mrhZ9zSgETgc8npSkCL8fN2BjYXfVGjkQXUJEx6QFXjY2cYne-ynv7OJclZFOox19RXxhCvyNRE7ONHoYWMLh7eTnblK3-fE6I-6nzwpxy5pcjMn6Rny8X5ee5qRQ3vv4S-2WG1CWBJnEZCiMgUzPH3o7jKnZke20nsj7z0tviv6J6JD3nNnGhsI9VQQPti6z9hzRy2bX2JF71v1gglU-YN3W&isca=1"
      />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
};
export default ServiceMeta;
