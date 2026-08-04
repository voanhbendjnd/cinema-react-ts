import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ProLayout } from '@ant-design/pro-components';
import { Dropdown, Badge, Tag } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    VideoCameraOutlined,
    MedicineBoxOutlined,
    KeyOutlined,
    SafetyCertificateOutlined,
    ScanOutlined,
    TagOutlined,
    BarChartOutlined,
    ShoppingCartOutlined,
    UndoOutlined,
    TeamOutlined,
    FileExcelOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/auth.service';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, role } = useAuthStore();
    const [pathname, setPathname] = useState(location.pathname);

    const roleName =
        role === 'ROLE_ADMIN'
            ? 'admin'
            : role === 'ROLE_MANAGER'
                ? 'manager'
                : role === 'ROLE_STAFF'
                    ? 'staff'
                    : 'customer';

    const roleLabel =
        role === 'ROLE_ADMIN'
            ? 'Administrator'
            : role === 'ROLE_MANAGER'
                ? 'Manager'
                : role === 'ROLE_STAFF'
                    ? 'Staff'
                    : 'Customer';

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (e) {
            console.error(e);
        }
        logout();
        navigate('/login');
    };

    // ✅ Build menu routes
    const getMenuRoutes = () => {
        const routes: any[] = [];

        // ═══════════════════════════════════════════════════════════
        // 🔐 ADMIN ONLY
        // ═══════════════════════════════════════════════════════════
        if (role === 'ROLE_ADMIN') {
            routes.push({
                path: '/admin/admin-only',
                name: 'ADMIN PANEL',
                icon: <SettingOutlined />,
                disabled: true,
                hideInMenu: false,
            });

            routes.push(
                {
                    path: '/admin/employees',
                    name: 'Employee Management',
                    icon: <TeamOutlined />,
                    description: 'Manage staff accounts',
                },
                {
                    path: '/admin/customers',
                    name: 'Customer Management',
                    icon: <UserOutlined />,
                    description: 'View all customers',
                },
                {
                    path: '/admin/roles',
                    name: 'Roles Management',
                    icon: <KeyOutlined />,
                    description: 'Configure user roles',
                },
                {
                    path: '/admin/permissions',
                    name: 'Permission Management',
                    icon: <SafetyCertificateOutlined />,
                    description: 'Manage permissions',
                }
            );
        }

        // ═══════════════════════════════════════════════════════════
        // 📋 MANAGER & ADMIN
        // ═══════════════════════════════════════════════════════════
        if (role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') {
            if (role === 'ROLE_ADMIN') {
                routes.push({
                    path: '/divider1',
                    name: 'MANAGEMENT',
                    hideInMenu: true,
                });
            } else {
                routes.push({
                    path: '/divider1',
                    name: 'MANAGEMENT',
                    hideInMenu: false,
                    disabled: true,
                });
            }

            routes.push(
                {
                    path: `/${roleName}/movies`,
                    name: 'Movies',
                    icon: <VideoCameraOutlined />,
                    description: 'Movie catalog management',
                },
                {
                    path: `/${roleName}/rooms`,
                    name: 'Rooms',
                    icon: <MedicineBoxOutlined />,
                    description: 'Cinema rooms & seats',
                },
                {
                    path: `/${roleName}/showtime/price`,
                    name: 'Pricing Configuration',
                    icon: <ScanOutlined />,
                    description: 'Seat pricing setup',
                },
                {
                    path: `/${roleName}/promotions`,
                    name: 'Promotions',
                    icon: <TagOutlined />,
                    description: 'Vouchers & discounts',
                }
            );

            // ═══════════════════════════════════════════════════════════
            // 📊 ANALYTICS
            // ═══════════════════════════════════════════════════════════
            routes.push({
                path: '/divider2',
                name: 'ANALYTICS',
                hideInMenu: false,
                disabled: true,
            });

            routes.push(
                {
                    path: `/${roleName}/bookings`,
                    name: 'Bookings',
                    icon: <ShoppingCartOutlined />,
                    description: 'All booking records',
                },
                {
                    path: `/${roleName}/statistics/movies`,
                    name: 'Top Movies',
                    icon: <BarChartOutlined />,
                    description: 'Revenue & performance',
                },
                {
                    path: `/${roleName}/statistics/occupancy/preview`,
                    name: 'Occupancy Report',
                    icon: <FileExcelOutlined />,
                    description: 'Generate & export reports',
                }
            );
        }

        // ═══════════════════════════════════════════════════════════
        // 🛒 STAFF, MANAGER & ADMIN
        // ═══════════════════════════════════════════════════════════
        if (role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER' || role === 'ROLE_STAFF') {
            if (role === 'ROLE_STAFF') {
                routes.push({
                    path: '/divider3',
                    name: 'OPERATIONS',
                    hideInMenu: false,
                    disabled: true,
                });
            } else {
                routes.push({
                    path: '/divider3',
                    name: 'OPERATIONS',
                    hideInMenu: false,
                    disabled: true,
                });
            }

            routes.push(
                {
                    path: `/${roleName}/booking`,
                    name: 'POS Booking',
                    icon: <ShoppingCartOutlined />,
                    description: 'Counter ticket sales',
                },
                {
                    path: `/${roleName}/refund`,
                    name: 'Refund',
                    icon: <UndoOutlined />,
                    description: 'Process refunds',
                },
                {
                    path: `/${roleName}/tickets`,
                    name: 'Ticket Management',
                    icon: <ScanOutlined />,
                },
            );
        }

        return routes.map((route) => {
            if (route.hideInMenu === false && route.disabled) {
                // Return divider style
                return {
                    ...route,
                    hideInMenu: false,
                };
            }
            return route;
        });
    };

    return (
        <div id="admin-layout" style={{ height: '100vh', overflow: 'auto' }}>
            <ProLayout
                title="🎬 Cinema Admin"
                // logo="🎬"
                layout="mix"
                splitMenus={false}
                fixSiderbar
                colorPrimary="#e63946"
                route={{
                    path: `/${roleName}`,
                    routes: getMenuRoutes(),
                }}
                location={{
                    pathname,
                }}
                menuItemRender={(item, dom) => {
                    // ✅ Handle dividers
                    if (item.path?.includes('divider')) {
                        return (
                            <div
                                style={{
                                    padding: '12px 24px',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: 'rgba(0,0,0,0.45)',
                                    letterSpacing: 1,
                                    marginTop: 8,
                                }}
                            >
                                {item.name}
                            </div>
                        );
                    }

                    // ✅ Regular menu items
                    return (
                        <div
                            onClick={() => {
                                setPathname(item.path || `/${roleName}`);
                                navigate(item.path || `/${roleName}`);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                            title={item.description}
                        >
                            <span>{dom}</span>
                        </div>
                    );
                }}
                avatarProps={{
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                    title: user?.name || user?.login || 'User',
                    size: 'large',
                    render: (_props, dom) => {
                        return (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'profile-header',
                                            label: (
                                                <div style={{ padding: '8px 0' }}>
                                                    <div
                                                        style={{
                                                            fontSize: 13,
                                                            fontWeight: 700,
                                                            color: '#fff',
                                                        }}
                                                    >
                                                        {user?.name || user?.login}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: 12,
                                                            color: 'rgba(255,255,255,0.6)',
                                                        }}
                                                    >
                                                        {user?.email}
                                                    </div>
                                                </div>
                                            ),
                                            disabled: true,
                                        },
                                        {
                                            type: 'divider',
                                        },
                                        {
                                            key: 'role',
                                            label: (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <span>Role</span>
                                                    <Tag
                                                        color={
                                                            role === 'ROLE_ADMIN'
                                                                ? 'red'
                                                                : role === 'ROLE_MANAGER'
                                                                    ? 'orange'
                                                                    : 'blue'
                                                        }
                                                        style={{
                                                            fontWeight: 600,
                                                            fontSize: 11,
                                                        }}
                                                    >
                                                        {roleLabel.toUpperCase()}
                                                    </Tag>
                                                </div>
                                            ),
                                            disabled: true,
                                        },
                                        {
                                            type: 'divider',
                                        },
                                        {
                                            key: 'logout',
                                            icon: <LogoutOutlined />,
                                            label: 'Logout',
                                            danger: true,
                                            onClick: handleLogout,
                                        },
                                    ],
                                }}
                                trigger={['click']}
                            >
                                <div
                                    style={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}
                                >
                                    {dom}
                                    <Badge
                                        count={
                                            <span
                                                style={{
                                                    background:
                                                        role === 'ROLE_ADMIN'
                                                            ? '#ef4444'
                                                            : role === 'ROLE_MANAGER'
                                                                ? '#f97316'
                                                                : '#3b82f6',
                                                    color: '#fff',
                                                    borderRadius: '50%',
                                                    width: 20,
                                                    height: 20,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {role === 'ROLE_ADMIN'
                                                    ? 'A'
                                                    : role === 'ROLE_MANAGER'
                                                        ? 'M'
                                                        : 'S'}
                                            </span>
                                        }
                                    />
                                </div>
                            </Dropdown>
                        );
                    },
                }}
            >
                <Outlet />
            </ProLayout>
        </div>
    );
};

export default AdminLayout;