import { useEffect, useState } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px'den küçükse mobil kabul edilir
    };

    handleResize(); // İlk yüklemede kontrol et
    window.addEventListener("resize", handleResize); // Boyut değiştiğinde kontrol et

    return () => {
      window.removeEventListener("resize", handleResize); // Temizleme
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
