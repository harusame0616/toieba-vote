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
        content="https://toiebavote.harusame.dev/_next/image?url=%2Flogo.png&w=1080&q=100"
      />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
};
export default ServiceMeta;
