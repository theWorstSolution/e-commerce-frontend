
const Footer = () => {
  return (
    <footer className="sectionCard centerChildren" style={{marginLeft:0, marginRight:0, flexDirection:'column', paddingTop:'20px'}}>
      <div style={{marginTop:'8px'}}>&copy; {new Date().getFullYear()} BKSHOP. All rights reserved.</div>
      <p>Developed by <a href='https://www.facebook.com/ncthanh01' target="_blank">Nguyen Chi Thanh</a></p>
    </footer>
  );
};

export default Footer;