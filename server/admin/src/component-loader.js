import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const Components = {
    OdemeDurumuBadge: componentLoader.add('OdemeDurumuBadge', './components/OdemeDurumuBadge'),
    Dashboard: componentLoader.add('Dashboard', './dashboard/Dashboard'),
    ImageCrop: componentLoader.add('ImageCrop', './components/ImageCrop/ImageCrop'),
    SystemStatus: componentLoader.add('SystemStatus', './pages/SystemStatus/SystemStatus'),
    StatusBadge: componentLoader.add('StatusBadge', './components/StatusBadge'),
    InvoiceStatusBadge: componentLoader.add('InvoiceStatusBadge', './components/InvoiceStatusBadge'),
    OrderShow: componentLoader.add('OrderShow', './components/OrderShow'),
    ProductShow: componentLoader.add('ProductShow', './components/ProductShow'),
    HistoryTimeline: componentLoader.add('HistoryTimeline', './components/HistoryTimeline'),
    Settings: componentLoader.add('Settings', './pages/Settings/Settings'),
    Accounting: componentLoader.add('Accounting', './pages/Accounting/Accounting'),
    Reorder: componentLoader.add('Reorder', './components/Reorder'),
    SubCategoryInput: componentLoader.add('SubCategoryInput', './components/SubCategoryInput'),
    KargolaAction: componentLoader.add('KargolaAction', './components/KargolaAction'),
    IptalEtAction: componentLoader.add('IptalEtAction', './components/IptalEtAction'),
    ApproveReturnAction: componentLoader.add('ApproveReturnAction', './components/ApproveReturn'),
    ReturnStatusBadge: componentLoader.add('ReturnStatusBadge', './components/ReturnStatusBadge'),
    ReturnShow: componentLoader.add('ReturnShow', './components/ReturnShow'),
    RejectReturnAction: componentLoader.add('RejectReturnAction', './components/RejectReturnAction'),
    ProductDescription: componentLoader.add('ProductDescription', './components/ProductDescription'),
};

componentLoader.override('Login', './components/Login');

export { componentLoader, Components };
