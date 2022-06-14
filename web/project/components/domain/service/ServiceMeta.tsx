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
        content="といえばボートは「OOといえばXX」といった連想を投稿・投票できるSNSです。あなた多数派？少数派？"
      />
      <meta
        property="twitter:description"
        content="といえばボートは「OOといえばXX」といった連想を投稿・投票できるSNSです。あなた多数派？少数派？"
      />
      <meta property="og:site_name" content="連想投稿SNS！といえばボート" />
      <meta
        property="og:image"
        content="https://storage.googleapis.com/toiebavote.harusame.dev/images/site-cover.png"
      />
      <meta
        property="twitter:image"
        content="https://storage.googleapis.com/toiebavote.harusame.dev/images/site-cover.png"
      />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
};
export default ServiceMeta;
