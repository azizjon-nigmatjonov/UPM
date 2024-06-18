const html2Text = (html) => {

  return <p dangerouslySetInnerHTML={{ __html: html }} ></p >
};

export default html2Text;
