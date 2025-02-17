import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER, CREATE_SUPPLIER } from '../services/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCPF, parseCPF } from '../utils/functions';
import { validateForm, ValidationResult } from '../utils/validations';

export default function Register() {
    const [activeTab, setActiveTab] = useState('user');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [errors, setErrors] = useState<ValidationResult | null>(null);

    const [createUser, { loading: loadingUser }] = useMutation(CREATE_USER);
    const [createSupplier, { loading: loadingSupplier }] = useMutation(CREATE_SUPPLIER);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let validationResults;
        if (activeTab === 'user') {
            validationResults = validateForm(name, email, password, cpf);
        } else {
            validationResults = validateForm(name, email, password, 'supplier');
        }
        console.log(activeTab);
        if (Object.values(validationResults).every(isValid => isValid)) {
            const mutation = activeTab === 'user' ? createUser : createSupplier;
            const variables = activeTab === 'user' 
            ? { input: { name, email, password, cpf }} 
            : { input: { name, email, password, }};
            mutation({ variables })
                .then(response => {
                    console.log(response);
                    if(activeTab === 'user') {
                        const data = response.data.createUser;
                        if (data) {
                            localStorage.setItem('authToken', JSON.stringify({
                                token: data.token,
                                user_id : data.id,
                            }));
                            window.location.href = `/dashboard/${activeTab}`;
                        }
                    } else {
                        const data = response.data.createSupplier;
                        if (data) {
                            localStorage.setItem('authToken', JSON.stringify({
                                token: data.token,
                                user_id : data.supplier.id,
                            }));
                            window.location.href = `/dashboard/${activeTab}`;
                        }
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            setErrors(validationResults);
            console.log(errors);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="space-y-6 w-full max-w-md">
                <div className="text-3xl font-bold text-center mb-8">Clarke</div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="flex w-full">
                        <TabsTrigger value="user" className="flex-1">Usuário</TabsTrigger>
                        <TabsTrigger value="supplier" className="flex-1">Fornecedor</TabsTrigger>
                    </TabsList>
                    <TabsContent value="user">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                            <Input type="text" placeholder="CPF" value={cpf} onChange={e => setCpf(formatCPF(e.target.value))} onBlur={() => parseCPF(cpf)} />
                            <Button type="submit" className="w-full bg-[#113463] text-white hover:bg-[#0f2f52]">
                                {loadingUser ? 'Loading...' : 'Criar conta'}
                            </Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="supplier">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                            <Button type="submit" className="w-full bg-[#113463] text-white hover:bg-[#0f2f52]">
                                {loadingSupplier ? 'Loading...' : 'Criar conta'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
