import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, ArrowLeft, Heart, Search, User, Sun, Moon, Settings, Plus, Trash2, Image as ImageIcon, Lock, LogIn, RefreshCw, FileSpreadsheet, FolderOpen } from "lucide-react";
import { CartProductItem } from "./components/CartItem";
import { CartSummary } from "./components/CartSummary";
import { MOCK_PRODUCTS } from "./constants";
import { ICartItem, Product, ViewMode, AppConfig, CustomerInfo, Order, DiscountCode, TaxConfig, CompanyInfo, CompanySection } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import * as XLSX from "xlsx";

export default function App() {
  const [products, setProducts] = useState<Product[]>([
    { 
      id: "SP001", 
      name: "SP1", 
      price: 10000, 
      image: "https://lh3.googleusercontent.com/u/0/d/1KD3exbovQ2YWrmVQ1dIfFGEKLhU-ThzS", 
      category: "a", 
      description: "TRYGU" 
    },
    { 
      id: "SP002", 
      name: "SP2", 
      price: 11000, 
      image: "https://lh3.googleusercontent.com/u/0/d/1Wa8igSyb6LVJfW-mcuADFpa8VRXrjBu3", 
      category: "a", 
      description: "CV" 
    },
    { 
      id: "SP003", 
      name: "SP3", 
      price: 12000, 
      image: "https://lh3.googleusercontent.com/u/0/d/1qjil9kWpPDU-ckUcTozpXoEZASqpPKfh", 
      category: "a", 
      description: "YTFG" 
    },
    { 
      id: "SP004", 
      name: "SP4", 
      price: 13000, 
      image: "https://lh3.googleusercontent.com/u/0/d/1fL1uEcUZiIxxH1rlht4cgH0ZhKqaD9_2", 
      category: "b", 
      description: "CYVB" 
    },
    { 
      id: "SP005", 
      name: "SP5", 
      price: 14000, 
      image: "https://lh3.googleusercontent.com/u/0/d/14OBmStA-2Me6koDXZrdTmu0OtWm2vYPF", 
      category: "b", 
      description: "HGJJ" 
    },
    { 
      id: "SP006", 
      name: "SP6", 
      price: 15000, 
      image: "https://lh3.googleusercontent.com/u/0/d/1enk7XbpypL8p1W0nNRHnQ2quzd9IsK1D", 
      category: "b", 
      description: "DT" 
    }
  ]);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("catalog");
  const [isDark, setIsDark] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Customer state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
    phone: "",
    address: "",
    note: ""
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSendingOrder, setIsSendingOrder] = useState(false);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [taxes, setTaxes] = useState<TaxConfig[]>([{ name: "Thuế GTGT", rate: 8 }]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    title: "Về chúng tôi",
    sections: [
      { label: "Giới thiệu", value: "Chào mừng bạn đến với cửa hàng của chúng tôi. Chúng tôi chuyên cung cấp các sản phẩm chất lượng cao với giá cả hợp lý." }
    ]
  });

  // Auth state
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Config state
  const [config, setConfig] = useState<AppConfig>({
    imageFolderLink: "https://drive.google.com/drive/folders/19bq-hcOS0YwKjpUOxaGJ3tn2le40OgTK?usp=drive_link",
    excelFileLink: "https://docs.google.com/spreadsheets/d/1JqhyuR1qZhyAgnhCA7PLCO4NfbzR6MWr2XRnoCPuz1E/edit?usp=sharing"
  });

  const [rawPasteData, setRawPasteData] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("luxe_products");
    const savedConfig = localStorage.getItem("luxe_config");
    const savedCart = localStorage.getItem("luxe_cart");
    const savedOrders = localStorage.getItem("luxe_orders");
    const savedCodes = localStorage.getItem("luxe_codes");
    const savedTax = localStorage.getItem("luxe_tax");
    const savedAbout = localStorage.getItem("luxe_about");
    
    if (savedProducts) {
      try { setProducts(JSON.parse(savedProducts)); } catch (e) {}
    }
    if (savedConfig) {
      try { setConfig(JSON.parse(savedConfig)); } catch (e) {}
    }
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch (e) {}
    }
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) {}
    }
    if (savedCodes) {
      try { setDiscountCodes(JSON.parse(savedCodes)); } catch (e) {}
    }
    if (savedTax) {
      try { 
        const parsedTax = JSON.parse(savedTax);
        if (Array.isArray(parsedTax)) {
          setTaxes(parsedTax);
        }
      } catch (e) {}
    }
    if (savedAbout) {
      try { setCompanyInfo(JSON.parse(savedAbout)); } catch (e) {}
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("luxe_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("luxe_config", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem("luxe_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("luxe_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("luxe_codes", JSON.stringify(discountCodes));
  }, [discountCodes]);

  useEffect(() => {
    localStorage.setItem("luxe_tax", JSON.stringify(taxes));
  }, [taxes]);

  useEffect(() => {
    localStorage.setItem("luxe_about", JSON.stringify(companyInfo));
  }, [companyInfo]);

  // New product form state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    image: "",
    category: "Phụ kiện",
    description: ""
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      price: Number(newProduct.price),
      image: newProduct.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
      category: newProduct.category || "Khác",
      description: newProduct.description || ""
    };

    setProducts(prev => [product, ...prev]);
    setNewProduct({ name: "", price: 0, image: "", category: "Phụ kiện", description: "" });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    // Optional: setViewMode("cart"); // Let's keep them on catalog for multiple additions
  };

  const [catalogQuantities, setCatalogQuantities] = useState<Record<string, number>>({});

  const updateCatalogQuantity = (productId: string, delta: number) => {
    setCatalogQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleCatalogQuantityInput = (productId: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1) {
      setCatalogQuantities(prev => ({
        ...prev,
        [productId]: numValue
      }));
    } else if (value === "") {
      setCatalogQuantities(prev => ({
        ...prev,
        [productId]: 1
      }));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded auth for demo purposes
    if (loginForm.username === "HUETTM" && loginForm.password === "123") {
      setIsLoggedIn(true);
      setViewMode("settings");
      setLoginError("");
    } else {
      setLoginError("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setViewMode("cart");
  };

  const handleSettingsClick = () => {
    if (isLoggedIn) {
      setViewMode("settings");
    } else {
      setViewMode("login");
    }
  };

  const syncProducts = async () => {
    if (!config.excelFileLink) {
      alert("Vui lòng điền link file Excel báo giá.");
      return;
    }
    
    setIsSyncing(true);
    try {
      // Extract Spreadsheet ID
      const match = config.excelFileLink.match(/\/d\/(.*?)(\/|$)/);
      if (!match) throw new Error("Link không hợp lệ");
      const spreadsheetId = match[1];

      // 1. Sync Price Sheet
      const priceUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=price`;
      const priceRes = await fetch(priceUrl);
      const priceCsv = await priceRes.text();
      
      const priceLines = priceCsv.split('\n').map(l => l.split('","').map(s => s.replace(/"/g, '')));
      // Headers: "Phân loại SP","MÃ SP BÁN","TÊN SP BÁN","ĐƠN GIÁ","MÔ TẢ SP","link SP"
      const newProducts: Product[] = priceLines.slice(1).filter(l => l[1]).map(l => {
        const driveIdMatch = l[5]?.match(/\/d\/(.*?)(\/|$)/);
        const driveId = driveIdMatch ? driveIdMatch[1] : "";
        return {
          id: l[1],
          name: l[2],
          price: parseFloat(l[3]) || 0,
          category: l[0],
          description: l[4],
          image: driveId ? `https://lh3.googleusercontent.com/u/0/d/${driveId}` : "https://picsum.photos/800/1000"
        };
      });

      // 2. Sync Discount Codes
      const codeUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=MA%20GIAM%20GIA`;
      const codeRes = await fetch(codeUrl);
      const codeCsv = await codeRes.text();
      const codeLines = codeCsv.split('\n').map(l => l.split('","').map(s => s.replace(/"/g, '')));
      // Headers: "MÃ GIẢM GIÁ","% GIẢM GIÁ","SỐ TIỀN GIẢM GIÁ"
      const newCodes: DiscountCode[] = codeLines.slice(1).filter(l => l[0]).map(l => {
        let percent: number | undefined = undefined;
        if (l[1]) {
          // Remove % sign and handle numeric conversion
          const cleanPercent = l[1].replace('%', '').trim();
          percent = parseFloat(cleanPercent);
        }
        return {
          code: l[0],
          percent: percent,
          amount: l[2] ? parseFloat(l[2]) : undefined
        };
      });

      setProducts(newProducts);
      setDiscountCodes(newCodes);

      // 3. Sync Tax
      let finalTaxes: TaxConfig[] = [];
      try {
        const taxUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=thue`;
        const taxRes = await fetch(taxUrl);
        const taxCsv = await taxRes.text();
        
        // Robust CSV row processing
        const rows = taxCsv.split(/\r?\n/).filter(row => row.trim());
        finalTaxes = rows.map(row => {
          // handles both "A","B" and A,B formats
          const parts = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const name = parts[0]?.replace(/^"|"$/g, '').trim() || "";
          const rateVal = parts[1]?.replace(/^"|"$/g, '').replace('%', '').trim() || "0";
          return {
            name,
            rate: parseFloat(rateVal) || 0
          };
        }).filter(t => t.name && !isNaN(t.rate));
        
        if (finalTaxes.length > 0) {
          setTaxes(finalTaxes);
        }
      } catch (e) {
        console.error("Tax sync error:", e);
      }

      // 4. Sync Company Info
      let syncStatus = { company: false, image: false, sectionsFound: 0, error: "" };
      try {
        // Try both "gioi thieu" and "giới thiệu"
        const sheetNames = ["gioi%20thieu", "gi%E1%BB%9Bi%20thi%E1%BB%87u"];
        let aboutCsv = "";
        
        for (const sheetName of sheetNames) {
          try {
            const aboutUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
            const aboutRes = await fetch(aboutUrl);
            if (aboutRes.ok) {
              const text = await aboutRes.text();
              if (text && !text.includes("html>")) {
                aboutCsv = text;
                break;
              }
            }
          } catch (e) {
            console.warn(`Failed to fetch sheet ${sheetName}`);
          }
        }
        
        if (aboutCsv) {
          const newInfo: CompanyInfo = { 
            title: companyInfo.title, 
            image: companyInfo.image,
            sections: [] 
          };
          
          const parseCSV = (text: string) => {
            const result = [];
            let row: string[] = [];
            let current = '';
            let inQuotes = false;
            for (let i = 0; i < text.length; i++) {
              const char = text[i];
              const next = text[i+1];
              if (char === '"' && inQuotes && next === '"') { current += '"'; i++; }
              else if (char === '"') { inQuotes = !inQuotes; }
              else if (char === ',' && !inQuotes) { row.push(current.trim()); current = ''; }
              else if ((char === '\n' || char === '\r') && !inQuotes) {
                if (current || row.length > 0) {
                  row.push(current.trim());
                  result.push(row);
                  row = [];
                  current = '';
                }
                if (char === '\r' && next === '\n') i++;
              }
              else { current += char; }
            }
            if (current || row.length > 0) { row.push(current.trim()); result.push(row); }
            return result;
          };

          const allData = parseCSV(aboutCsv);
          if (allData.length > 0) {
            syncStatus.company = true;
            const sections: CompanySection[] = [];
            
            const getDriveUrl = (val: string) => {
              if (!val) return "";
              const dMatch = val.match(/\/d\/(.*?)(\/|$)/);
              if (dMatch) return `https://lh3.googleusercontent.com/u/0/d/${dMatch[1]}`;
              const idMatch = val.match(/[?&]id=(.*?)(&|$)/);
              if (idMatch) return `https://lh3.googleusercontent.com/u/0/d/${idMatch[1]}`;
              if (val.includes("drive.google.com") || val.includes("googleusercontent.com")) return val;
              return val;
            };

            allData.forEach(row => {
              const label = row[0] || "";
              const value = row[1] || "";
              if (!label || !value) return;

              const key = label.toLowerCase();
              if (key.includes("tiêu đề") || key.includes("title")) {
                newInfo.title = value;
              } else if (key.includes("hình ảnh") || key.includes("image") || key.includes("ảnh")) {
                newInfo.image = getDriveUrl(value);
                if (newInfo.image) syncStatus.image = true;
              } else {
                sections.push({ label, value: getDriveUrl(value) || value });
              }
            });
            
            newInfo.sections = sections;
            syncStatus.sectionsFound = sections.length;
            setCompanyInfo(newInfo);
          }
        } else {
          syncStatus.error = "Không tìm thấy sheet 'gioi thieu' hoặc 'giới thiệu'. Hãy kiểm tra tên sheet trong Excel.";
        }
      } catch (e) {
        console.error("About sync error:", e);
        syncStatus.error = "Lỗi kết nối dữ liệu giới thiệu.";
      }

      const syncMsg = [
        `Đồng bộ hoàn tất!`,
        `- ${newProducts.length} sản phẩm`,
        `- ${newCodes.length} mã giảm giá`,
        `- Thuế: ${finalTaxes.length} loại`,
        syncStatus.company ? `- Thông tin công ty: Đã tải (${syncStatus.sectionsFound} mục)` : `- Thông tin công ty: THẤT BẠI`,
        syncStatus.image ? `- Ảnh bìa: Đã tìm thấy` : `- Ảnh bìa: KHÔNG TÌM THẤY`,
        syncStatus.error ? `\nLưu ý: ${syncStatus.error}` : ""
      ].filter(Boolean).join('\n');
      
      alert(syncMsg);

    } catch (error) {
      console.error("Sync error:", error);
      alert("Có lỗi xảy ra khi đồng bộ từ link. Vui lòng kiểm tra quyền truy cập file.");
    } finally {
      setIsSyncing(false);
    }
  };

  const smartSync = async () => {
    if (!rawPasteData.trim()) {
      alert("Vui lòng dán dữ liệu từ Cột A (Mã SP) và các cột khác từ Excel vào ô bên dưới.");
      return;
    }

    if (!config.imageFolderLink) {
      alert("Vui lòng điền Link Folder Ảnh để hệ thống có thể mapping hình ảnh theo Mã SP.");
      return;
    }

    setIsSyncing(true);
    try {
      // Logic: Tên hình (không đuôi) = Mã SP (Cột A)
      const lines = rawPasteData.split('\n').filter(line => line.trim());
      
      const newProducts: Product[] = lines.map((line, index) => {
        const parts = line.split(/[\t]/); // Excel usually uses Tabs
        const maSP = parts[0]?.trim() || `SP-${index + 1}`;
        
        // Construct image URL based on Folder Link + Mã SP
        // Note: For demo, we append the code to the folder link. 
        // In reality, this would involve a lookup in the folder.
        let imageUrl = "";
        if (config.imageFolderLink.includes("drive.google.com")) {
          // Placeholder for Google Drive logic - usually needs a specific file ID
          // For now, we'll use a high-quality placeholder that represents the "Mapped" state
          imageUrl = `https://picsum.photos/seed/${maSP}/800/1000`;
        } else {
          // Generic folder mapping: FolderURL/MãSP.jpg
          const baseUrl = config.imageFolderLink.endsWith('/') ? config.imageFolderLink : config.imageFolderLink + '/';
          imageUrl = `${baseUrl}${maSP}.jpg`;
        }

        return {
          id: maSP,
          name: parts[1]?.trim() || `Sản phẩm ${maSP}`,
          price: parseFloat(parts[2]?.replace(/[^0-9.]/g, '')) || 0,
          image: imageUrl,
          category: parts[3]?.trim() || "Đồng bộ",
          description: parts[4]?.trim() || `Sản phẩm có mã ${maSP}. Hình ảnh được mapping tự động từ folder.`
        };
      });

      if (newProducts.length > 0) {
        setProducts(newProducts);
        setRawPasteData("");
        alert(`Đồng bộ thành công!\n- Đã khớp ${newProducts.length} sản phẩm.\n- Mã SP (Cột A) đã được mapping với tên hình trong folder.`);
      }
    } catch (error) {
      alert("Lỗi định dạng dữ liệu. Vui lòng copy đủ các cột từ Excel (bắt đầu từ Cột A: Mã SP).");
    } finally {
      setIsSyncing(false);
    }
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ["Tất cả", ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Filter by category
    if (selectedCategory !== "Tất cả") {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Filter by search term (id or name)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.id.toLowerCase().includes(term) || 
        p.name.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [products, selectedCategory, searchTerm]);

  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filteredProducts.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [filteredProducts]);

  const sendOrder = async () => {
    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống.");
      return;
    }

    setIsSendingOrder(true);
    
    try {
      const discountVal = appliedDiscount ? (appliedDiscount.percent ? (subtotal * appliedDiscount.percent / 100) : (appliedDiscount.amount || 0)) : 0;
      
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        items: [...cartItems],
        customer: { ...customerInfo },
        subtotal: subtotal,
        taxAmount: totalTax,
        shippingFee: shipping,
        discountAmount: discountVal,
        discountCode: appliedDiscount?.code,
        finalTotal: subtotal + totalTax + shipping - discountVal,
        status: "pending",
        timestamp: new Date().toISOString()
      };

      // Store order locally
      setOrders(prev => [newOrder, ...prev]);

      alert("Đơn hàng của bạn đã được gửi thành công! Bạn có thể theo dõi đơn hàng tại phần quản trị.");
      setCartItems([]);
      setCustomerInfo({ fullName: "", phone: "", address: "", note: "" });
      setCatalogQuantities({});
      setAppliedDiscount(null);
      setViewMode("catalog");
    } catch (error) {
      alert("Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsSendingOrder(false);
    }
  };

  const deleteOrder = (orderId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  const exportOrdersToExcel = () => {
    if (orders.length === 0) {
      alert("Không có đơn hàng nào để xuất.");
      return;
    }

    const flattenedData: any[] = [];

    orders.forEach(order => {
      order.items.forEach(item => {
        flattenedData.push({
          "Mã đơn hàng": order.id,
          "Ngày đặt": new Date(order.timestamp).toLocaleString("vi-VN"),
          "Khách hàng": order.customer.fullName,
          "Số điện thoại": order.customer.phone,
          "Địa chỉ": order.customer.address,
          "Mã SP": item.id,
          "Tên SP": item.name,
          "Số lượng đặt": item.quantity,
          "Đơn giá": item.price,
          "Thành tiền (Sản phẩm)": item.price * item.quantity,
          "Tạm tính (Đơn hàng)": order.subtotal,
          "Thuế": order.taxAmount,
          "Vận chuyển": order.shippingFee,
          "Mã giảm giá": order.discountCode || "",
          "Số tiền giảm": order.discountAmount,
          "Tổng thanh toán": order.finalTotal,
          "Trạng thái": order.status === "pending" ? "Chờ xử lý" : "Hoàn tất"
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ChiTietDonHang");
    
    // Auto-size columns better
    const wscols = [
      { wch: 20 }, // Mã đơn
      { wch: 20 }, // Ngày đặt
      { wch: 20 }, // Khách hàng
      { wch: 15 }, // SĐT
      { wch: 30 }, // Địa chỉ
      { wch: 10 }, // Mã SP
      { wch: 25 }, // Tên SP
      { wch: 12 }, // Số lượng
      { wch: 12 }, // Đơn giá
      { wch: 15 }, // Thành tiền SP
      { wch: 15 }, // Tạm tính ĐH
      { wch: 12 }, // Thuế
      { wch: 12 }, // Vận chuyển
      { wch: 15 }, // Mã GG
      { wch: 12 }, // Tiền giảm
      { wch: 15 }, // Tổng
      { wch: 15 }  // Trạng thái
    ];
    worksheet["!cols"] = wscols;

    XLSX.writeFile(workbook, `Chi_Tiet_Don_Hang_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const subtotal = useMemo(() => 
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  const shipping = 0; // Tạm thời chưa tính
  
  const taxInfo = useMemo(() => {
    return taxes.map(t => ({
      ...t,
      amount: subtotal * (t.rate / 100)
    }));
  }, [taxes, subtotal]);

  const totalTax = useMemo(() => 
    taxInfo.reduce((acc, t) => acc + t.amount, 0),
    [taxInfo]
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground transition-colors duration-500">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-[60px] h-[105px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <h1 className="text-2xl font-heading italic tracking-[2px] cursor-pointer" onClick={() => setViewMode("cart")}>
              Elysian & Co.
            </h1>
            <div className="hidden md:flex items-center gap-10 text-[12px] uppercase tracking-[1px] opacity-60">
              <button onClick={() => setViewMode("catalog")} className={`hover:opacity-100 transition-opacity ${viewMode === 'catalog' ? 'opacity-100 font-bold' : ''}`}>Bộ sưu tập</button>
              <button onClick={() => setViewMode("about")} className={`hover:opacity-100 transition-opacity ${viewMode === 'about' ? 'opacity-100 font-bold' : ''}`}>Giới thiệu</button>
              <button onClick={() => setViewMode("cart")} className={`hover:opacity-100 transition-opacity ${viewMode === 'cart' ? 'opacity-100 font-bold' : ''}`}>Giỏ hàng</button>
              {isLoggedIn && (
                <button onClick={() => setViewMode("settings")} className={`hover:opacity-100 transition-opacity ${viewMode === 'settings' ? 'opacity-100 font-bold' : ''}`}>Quản lý hệ thống</button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${viewMode === 'settings' || viewMode === 'login' ? 'text-accent' : ''}`}
              onClick={handleSettingsClick}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <div className="text-[12px] uppercase tracking-[1px] opacity-60 hidden sm:block">
              {isLoggedIn ? "Admin" : "Tài khoản"}
            </div>
            {isLoggedIn && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[10px] uppercase font-bold opacity-60 hover:opacity-100"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full relative"
              onClick={() => setViewMode("cart")}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-[60px] pt-[165px] pb-24">
        {viewMode === "catalog" ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div>
                <h2 className="text-5xl font-heading font-bold mb-4">Bộ sưu tập</h2>
                <p className="text-muted-foreground max-w-md">
                  Khám phá những sản phẩm tinh tế nhất được tuyển chọn dành riêng cho bạn.
                </p>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-foreground" />
                  <Input 
                    placeholder="Tìm theo Mã SP hoặc Tên SP..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 w-full lg:w-[400px] bg-card border-border rounded-2xl shadow-sm italic text-sm"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-[2px] font-bold transition-all border ${
                        selectedCategory === cat 
                          ? 'bg-accent text-white border-accent' 
                          : 'bg-transparent text-foreground/60 border-border hover:border-accent/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-20">
              {(Object.entries(groupedProducts) as [string, Product[]][]).length > 0 ? (
                (Object.entries(groupedProducts) as [string, Product[]][]).map(([category, items]) => (
                  <div key={category} className="space-y-10">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-heading font-bold uppercase tracking-widest pl-2 border-l-4 border-accent">
                        Phân loại: {category}
                      </h3>
                      <div className="h-[1px] flex-1 bg-border/50" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {items.map(product => (
                        <motion.div 
                          key={product.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group"
                        >
                          <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] bg-muted mb-6 shadow-sm border border-border/50">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-accent shadow-sm border border-border/20">
                                {product.id}
                              </span>
                            </div>
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="space-y-3 px-2">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-bold text-lg group-hover:text-accent transition-colors truncate">{product.name}</h3>
                              <span className="font-black text-accent text-sm whitespace-nowrap">{product.price.toLocaleString()} VNĐ</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed h-8">
                              {product.description}
                            </p>
                            
                            <div className="pt-4 flex items-center gap-3">
                              <div className="flex items-center gap-1 border border-border rounded-xl px-3 py-2 bg-muted/20">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); updateCatalogQuantity(product.id, -1); }}
                                  className="w-6 h-6 flex items-center justify-center hover:text-accent font-bold text-lg"
                                >
                                  -
                                </button>
                                <input 
                                  type="text"
                                  value={catalogQuantities[product.id] || 1}
                                  onChange={(e) => handleCatalogQuantityInput(product.id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-10 text-center text-xs font-bold bg-transparent outline-none focus:text-accent"
                                />
                                <button 
                                  onClick={(e) => { e.stopPropagation(); updateCatalogQuantity(product.id, 1); }}
                                  className="w-6 h-6 flex items-center justify-center hover:text-accent font-bold text-lg"
                                >
                                  +
                                </button>
                              </div>
                              <Button 
                                onClick={(e) => { e.stopPropagation(); addToCart(product, catalogQuantities[product.id] || 1); }}
                                className="flex-1 h-11 bg-foreground text-background hover:bg-accent hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-[2px] transition-all"
                              >
                                Thêm vào túi
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="text-muted-foreground italic">Không tìm thấy sản phẩm nào khớp với từ khóa "{searchTerm}"</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : viewMode === "about" ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto space-y-32 py-12"
          >
            {/* Elegant Hero Section */}
            <section className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-16 items-center">
                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-[1px] bg-accent" />
                      <span className="text-[11px] uppercase font-bold tracking-[6px] text-accent">Câu chuyện của chúng tôi</span>
                    </div>
                    <h1 className="text-8xl md:text-9xl font-heading font-black leading-[0.85] tracking-tighter text-foreground">
                      {companyInfo.title}
                    </h1>
                  </motion.div>
                </div>
                
                {companyInfo.image && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative group"
                  >
                    <div className="aspect-[3/4] rounded-[80px] overflow-hidden shadow-2xl border-[12px] border-card">
                      <img 
                        src={companyInfo.image} 
                        alt={companyInfo.title}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
                  </motion.div>
                )}
              </div>
            </section>

            {/* Content Sections - Clean Vertical Editorial Flow */}
            <div className="space-y-24">
              {companyInfo.sections.map((section, idx) => {
                const isImage = section.value.startsWith("http") && (section.value.includes("googleusercontent") || section.value.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i));
                
                return (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-16 items-start"
                  >
                    <div className="sticky top-32">
                      <div className="space-y-4">
                        <span className="text-[9px] font-black tracking-[4px] text-accent/40 block">0{idx + 1}</span>
                        <h2 className="text-xs uppercase font-black tracking-[3px] leading-tight max-w-[150px]">
                          {section.label}
                        </h2>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      {isImage ? (
                        <div className="rounded-[40px] overflow-hidden border border-border shadow-sm bg-muted/20">
                          <img src={section.value} alt={section.label} className="w-full aspect-video object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <div className="text-2xl md:text-3xl font-light leading-relaxed text-muted-foreground font-serif italic text-pretty">
                          {section.value}
                        </div>
                      )}
                      <div className="h-[1px] w-full bg-border/40" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer Minimal Action */}
            <section className="pt-24 text-center space-y-12">
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase font-bold tracking-[8px] opacity-20">Khám phá tuyệt tác</h3>
                <div className="h-12 w-[1px] bg-border mx-auto" />
              </div>
              <Button 
                onClick={() => setViewMode("catalog")} 
                className="h-20 px-16 rounded-full bg-foreground text-background hover:bg-accent hover:text-white transition-all transform hover:scale-105 active:scale-95 text-[11px] font-black uppercase tracking-[4px] shadow-xl"
              >
                Ghé thăm cửa hàng
              </Button>
            </section>
          </motion.div>
        ) : viewMode === "cart" ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-[60px]">
            {/* Cart Items Section */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-heading font-bold mb-2">Túi mua sắm của bạn</h2>
                  <p className="text-muted-foreground">
                    Có {cartItems.length} sản phẩm trong lựa chọn của bạn
                  </p>
                </div>
                <Button variant="ghost" className="text-accent hover:text-accent/80 group" onClick={() => setViewMode("catalog")}>
                  <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Tiếp tục mua sắm
                </Button>
              </div>

              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {cartItems.length > 0 ? (
                    cartItems.map(item => (
                      <CartProductItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-24 text-center"
                    >
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-2xl font-heading mb-2">Giỏ hàng trống</h3>
                      <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
                        Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
                      </p>
                      <Button className="rounded-full px-8" onClick={() => setViewMode("catalog")}>Bắt đầu mua sắm</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {cartItems.length > 0 && (
                <div className="mt-12 p-8 rounded-3xl bg-muted/30 border border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-background shadow-sm">
                      <Heart className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Quà tặng đi kèm</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Tất cả các đơn hàng đều được giao trong bao bì bền vững đặc trưng của chúng tôi.
                        Thêm tin nhắn cá nhân khi thanh toán.
                      </p>
                      <Button variant="outline" size="sm" className="rounded-full">Thêm lời chúc</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Section */}
            <div className="lg:w-[400px]">
              {cartItems.length > 0 && (
                <CartSummary
                  subtotal={subtotal}
                  shipping={0} // Tạm thời chưa tính
                  taxes={taxInfo}
                  customerInfo={customerInfo}
                  discountCodes={discountCodes}
                  appliedDiscount={appliedDiscount}
                  onCustomerInfoChange={setCustomerInfo}
                  onApplyDiscount={setAppliedDiscount}
                  onSendOrder={sendOrder}
                  isSending={isSendingOrder}
                />
              )}
            </div>
          </div>
        ) : viewMode === "login" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto py-12"
          >
            <div className="bg-card p-10 rounded-[32px] border border-border shadow-2xl">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
                  <Lock className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-3xl font-heading font-bold mb-2">Quản trị viên</h2>
                <p className="text-muted-foreground">Vui lòng đăng nhập để quản lý cửa hàng</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[2px] font-bold opacity-50 mb-2 block">Tên đăng nhập</label>
                  <Input 
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    className="h-12 bg-background border-border rounded-xl"
                    placeholder="admin"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[2px] font-bold opacity-50 mb-2 block">Mật khẩu</label>
                  <Input 
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="h-12 bg-background border-border rounded-xl"
                    placeholder="••••••"
                  />
                </div>

                {loginError && (
                  <p className="text-destructive text-xs font-medium text-center">{loginError}</p>
                )}

                <Button type="submit" className="w-full h-14 bg-accent text-white hover:bg-accent/90 rounded-xl font-bold text-sm uppercase tracking-[2px]">
                  Đăng nhập
                </Button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-heading font-bold mb-2">Quản lý hệ thống</h2>
                <p className="text-muted-foreground">Đồng bộ dữ liệu từ Excel và Folder ảnh</p>
              </div>
              <Button variant="outline" className="rounded-full" onClick={() => setViewMode("cart")}>
                Quay lại cửa hàng
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
              {/* Configuration Section */}
              <div className="space-y-6">
                <div className="bg-card p-8 rounded-3xl border border-border sticky top-32">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-accent" />
                    Cấu hình nguồn
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-[2px] font-bold opacity-50 mb-2 block flex items-center gap-2">
                        <FileSpreadsheet className="w-3 h-3" /> Link File Excel Báo Giá
                      </label>
                      <Input 
                        value={config.excelFileLink}
                        onChange={(e) => setConfig({...config, excelFileLink: e.target.value})}
                        placeholder="Link Google Sheets..." 
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={syncProducts}
                        disabled={isSyncing}
                        className="flex-1 h-12 bg-accent text-white hover:bg-accent/90 rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                        {isSyncing ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        Cập nhật dữ liệu
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders History Section */}
              <div className="space-y-6">
                <div className="bg-card p-8 rounded-3xl border border-border">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <ShoppingBag className="w-6 h-6 text-accent" />
                      Lưu trữ đơn hàng ({orders.length})
                    </h3>
                    {orders.length > 0 && (
                      <Button 
                        onClick={exportOrdersToExcel}
                        variant="outline" 
                        className="bg-green-500/10 border-green-500/30 text-green-600 hover:bg-green-500 hover:text-white gap-2"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Xuất Excel
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {orders.length > 0 ? (
                      orders.map(order => (
                        <div key={order.id} className="p-6 bg-muted/20 border border-border rounded-2xl group relative">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-1 rounded mb-2 inline-block">
                                {order.id}
                              </span>
                              <h4 className="font-bold text-lg">{order.customer.fullName}</h4>
                              <p className="text-xs opacity-60 italic">{new Date(order.timestamp).toLocaleString()}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteOrder(order.id)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-xs space-y-1">
                              <p><strong>SĐT:</strong> {order.customer.phone}</p>
                              <p><strong>Địa chỉ:</strong> {order.customer.address}</p>
                              {order.customer.note && <p><strong>Ghi chú:</strong> {order.customer.note}</p>}
                            </div>
                            <div className="text-xs text-right">
                              <p><strong>Tạm tính:</strong> {(order.subtotal || order.total || 0).toLocaleString()} VNĐ</p>
                              {order.taxAmount !== undefined && <p><strong>Thuế:</strong> {order.taxAmount.toLocaleString()} VNĐ</p>}
                              {order.shippingFee !== undefined && <p><strong>Vận chuyển:</strong> {order.shippingFee.toLocaleString()} VNĐ</p>}
                              {order.discountAmount > 0 && (
                                <p className="text-accent">
                                  <strong>Giảm giá {order.discountCode ? `(${order.discountCode})` : ""}:</strong> -{order.discountAmount.toLocaleString()} VNĐ
                                </p>
                              )}
                              <p className="text-lg font-black mt-1">{order.finalTotal.toLocaleString()} VNĐ</p>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-border/50">
                            <details className="cursor-pointer">
                              <summary className="text-[10px] uppercase font-bold opacity-40 hover:opacity-100">Chi tiết sản phẩm</summary>
                              <div className="mt-2 space-y-2">
                                {order.items.map(item => (
                                  <div key={item.id} className="flex justify-between text-xs opacity-80 italic">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>{(item.price * item.quantity).toLocaleString()} VNĐ</span>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center opacity-40">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
                        <p>Chưa có đơn hàng nào được lưu trữ</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-muted/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-sm text-muted-foreground">
            © 2026 ELYSIAN & CO. TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU.
          </div>
          <div className="flex gap-8 text-xs font-bold tracking-widest uppercase opacity-60">
            <a href="#" className="hover:opacity-100 transition-opacity">Chính sách bảo mật</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Điều khoản dịch vụ</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Giao hàng & Trả hàng</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
