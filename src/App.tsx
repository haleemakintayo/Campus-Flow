import { useState, useEffect } from 'react';
import Map from './components/Map';
import BusList from './components/BusList';
import RouteSearch from './components/RouteSearch';
import CrowdAnalytics from './components/CrowdAnalytics';
import { CAMPUS_CENTER } from './constants';
import { Bus, Route } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Map as MapIcon, Search, BarChart3, Menu, X, Settings, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, onSnapshot, query, getDocFromServer, doc } from 'firebase/firestore';

import { seedDatabase } from './seed';
import { Database } from 'lucide-react';

export default function App() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const isAdmin = user?.email === "haleemakintayo@gmail.com";

  const handleSeed = async () => {
    setIsSeeding(true);
    await seedDatabase();
    setIsSeeding(false);
  };

  // Test connection and fetch initial data
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Real-time sync for buses and routes
  useEffect(() => {
    if (authLoading) return;

    const busesPath = 'buses';
    const routesPath = 'routes';

    const unsubBuses = onSnapshot(collection(db, busesPath), (snapshot) => {
      const busData = snapshot.docs.map(doc => doc.data() as Bus);
      setBuses(busData);
      setIsDataReady(true);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, busesPath);
    });

    const unsubRoutes = onSnapshot(collection(db, routesPath), (snapshot) => {
      const routeData = snapshot.docs.map(doc => doc.data() as Route);
      setRoutes(routeData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, routesPath);
    });

    return () => {
      unsubBuses();
      unsubRoutes();
    };
  }, [authLoading]);

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Initializing CampusFlow...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full shadow-2xl border-none overflow-hidden">
          <div className="bg-primary p-8 text-primary-foreground text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <MapIcon size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">CampusFlow</h1>
            <p className="text-primary-foreground/80">Real-time Campus Transit Management</p>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-bold">Welcome Back</h2>
              <p className="text-sm text-muted-foreground">Sign in with your campus account to access live tracking and route planning.</p>
            </div>
            <Button onClick={login} className="w-full h-12 text-lg gap-3" size="lg">
              <LogIn size={20} />
              Sign in with Google
            </Button>
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
              Secure Campus Authentication
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Sleek Header */}
      <header className="h-16 bg-card border-b flex items-center justify-between px-6 shrink-0 z-[1001]">
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-1">
            CAMPUS<span className="text-primary">TRANSIT</span> PRO
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <div className="sleek-pill sleek-pill-warning">Peak Rush Hour (08:45 AM)</div>
          <div className="sleek-pill">Active Buses: {buses.length}</div>
          <div className="sleek-pill">System: Optimal</div>
          <div className="w-[1px] h-4 bg-border mx-2" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="text-primary" size={16} />
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <LogOut size={16} />
            </Button>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] p-0 flex flex-col bg-card border-r">
              <div className="p-6 border-b flex items-center justify-between">
                <div className="text-xl font-bold tracking-tighter">
                  CAMPUS<span className="text-primary">TRANSIT</span> PRO
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut size={18} />
                </Button>
              </div>
              <Tabs defaultValue="search" className="flex flex-col flex-1">
                <div className="px-4 py-4">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="search">Routes</TabsTrigger>
                    <TabsTrigger value="buses">Buses</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                  </TabsList>
                </div>
                <ScrollArea className="flex-1 px-4">
                  <TabsContent value="search" className="mt-0">
                    <RouteSearch routes={routes} onSelectRoute={setSelectedRouteId} />
                  </TabsContent>
                  <TabsContent value="buses" className="mt-0">
                    <BusList buses={buses} routes={routes} />
                  </TabsContent>
                  <TabsContent value="stats" className="mt-0">
                    <CrowdAnalytics />
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex flex-col w-80 border-r bg-card transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full w-0 border-none'}`}>
          <Tabs defaultValue="search" className="flex-1 flex flex-col pt-6">
            <div className="px-6">
              <TabsList className="w-full grid grid-cols-3 bg-white/5 border border-border">
                <TabsTrigger value="search" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Search size={14} />
                </TabsTrigger>
                <TabsTrigger value="buses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <MapIcon size={14} />
                </TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <BarChart3 size={14} />
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-6 py-6">
              <TabsContent value="search" className="mt-0 space-y-4">
                <RouteSearch 
                  routes={routes} 
                  onSelectRoute={setSelectedRouteId} 
                />
              </TabsContent>
              <TabsContent value="buses" className="mt-0 space-y-4">
                <BusList 
                  buses={buses} 
                  routes={routes} 
                />
              </TabsContent>
              <TabsContent value="stats" className="mt-0 space-y-4">
                <CrowdAnalytics />
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <div className="p-6 border-t bg-white/5 space-y-4">
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5 h-10"
                onClick={handleSeed}
                disabled={isSeeding}
              >
                <Database size={14} />
                {isSeeding ? 'Seeding...' : 'Seed Database'}
              </Button>
            )}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <span>TransitFlow AI v2.4</span>
              <span>Refresh: 2s ago</span>
            </div>
          </div>
        </aside>

        {/* Main Map Area */}
        <main className="flex-1 relative bg-[#111827]">
          {/* Desktop Toggle Sidebar Button */}
          {!isSidebarOpen && (
            <Button 
              size="icon" 
              variant="outline"
              className="hidden lg:flex absolute top-4 left-4 z-[1000] shadow-xl bg-card border-border"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>
          )}

          {/* Map Component */}
          <Map 
            center={CAMPUS_CENTER} 
            buses={buses} 
            routes={routes} 
            selectedRouteId={selectedRouteId}
          />

          {/* Legend / Quick Stats Overlay */}
          <div className="absolute bottom-8 right-8 z-[1000] hidden md:flex flex-col gap-2">
            <div className="bg-card/90 backdrop-blur-md shadow-2xl border border-border rounded-xl p-4 flex gap-6">
              <div className="flex flex-col">
                <span className="sleek-label mb-1">Active Buses</span>
                <span className="text-xl font-bold tracking-tight">{buses.length}</span>
              </div>
              <div className="w-[1px] bg-border" />
              <div className="flex flex-col">
                <span className="sleek-label mb-1">Avg. Load</span>
                <span className="text-xl font-bold tracking-tight">
                  {buses.length > 0 
                    ? Math.round(buses.reduce((acc, b) => acc + (b.currentOccupancy / b.capacity), 0) / buses.length * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-[1px] bg-border" />
              <div className="flex flex-col">
                <span className="sleek-label mb-1">Next Arrival</span>
                <span className="text-xl font-bold tracking-tight text-primary">4m</span>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Sleek Footer */}
      <footer className="h-10 bg-[#0c111d] border-t border-border flex items-center px-6 text-[11px] text-muted-foreground shrink-0">
        <div className="mr-6">Lat: 42.3601 | Lon: -71.0589</div>
        <div>Data Refresh: 2s ago</div>
        <div className="ml-auto">Powered by TransitFlow AI v2.4</div>
      </footer>
    </div>
  );

}
