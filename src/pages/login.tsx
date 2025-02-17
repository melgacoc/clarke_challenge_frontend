import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, LOGIN_SUPPLIER } from '../services/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'user' | 'supplier'>('user');

  const [loginUser, { loading: loadingUser }] = useMutation(LOGIN_USER);
  const [loginSupplier, { loading: loadingSupplier }] = useMutation(LOGIN_SUPPLIER);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const loginMutation = activeTab === 'user' ? loginUser : loginSupplier;

    try {
      const response = await loginMutation({ variables: { input: { email, password }} });
      const userData = response.data?.loginUser || response.data?.loginSupplier;
      if (userData) {
        const user = userData.user || userData.supplier;
        localStorage.setItem('authToken', JSON.stringify({
          token: userData.token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: activeTab === 'user' ? 'user' : 'supplier',
        }));
        window.location.href = `/dashboard/${activeTab}`;
      }
    } catch (error) {
      alert('Invalid email or password');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-6 w-full w-300px">
        <div className="text-3xl font-bold text-center">Clarke</div>
        <Tabs defaultValue="user" onValueChange={(val) => setActiveTab(val as 'user' | 'supplier')}>
          <TabsList className="flex justify-center">
            <TabsTrigger value="user">Usuário</TabsTrigger>
            <TabsTrigger value="supplier">Fornecedor</TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" size="lg" className="w-full" disabled={loadingUser || loadingSupplier}>
                {loadingUser ? 'Carregando...' : 'Login'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="supplier">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" size="lg" className="w-full" disabled={loadingUser || loadingSupplier}>
                {loadingSupplier ? 'Carregando...' : 'Login'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
