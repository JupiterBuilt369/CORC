import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "CORC | Luxury Streetwear";
    
    if (path.includes("/shop")) title = "Catalog | CORC";
    if (path.includes("/product")) title = "Item Details | CORC";
    if (path.includes("/checkout")) title = "Checkout | CORC";
    if (path.includes("/lookbook")) title = "Editorial | CORC";
    if (path.includes("/admin")) title = "Command Center | CORC";
    
    document.title = title;
  }, [location]);

  return null;
};

export default PageTitle;