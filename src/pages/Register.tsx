import {
    Paper,
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
    rem,
} from '@mantine/core';
import toast, { Toaster } from 'react-hot-toast';
import { IconArrowBackUp } from '@tabler/icons-react';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { PasswordStrength } from '../components/Auth/PasswordInput';

import { register } from '../services/auth';
import { useAtom } from 'jotai';
import { strengthAtom, userAtom } from '../atoms/authAtoms';

const useStyles = createStyles((theme) => ({
    wrapper: {
        minHeight: rem(900),
        backgroundSize: 'cover',
        backgroundImage:
            'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
    },

    form: {
        borderRight: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
            }`,
        minHeight: rem(900),
        maxWidth: rem(450),
        paddingTop: rem(80),

        [theme.fn.smallerThan('sm')]: {
            maxWidth: '100%',
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
}));

interface IFormData {
    email: string;
    name: string;
    password: string;
}

export function Register() {
    const { classes } = useStyles();
    const [data, setData] = useState<IFormData>({ email: "", name: "", password: "" })
    const [, setUser] = useAtom(userAtom)
    const [strength] = useAtom(strengthAtom)
    const navigate = useNavigate()

    const disabled = strength < 100 || data.email === "" || data.name === "" || data.password === ""

    const submitHandle = async(e: any) => {
        e.preventDefault()

        try {
            const response = await register(data)
            localStorage.setItem("token", response.data.accessToken)
            setUser({email: data.email, name: data.name})
            navigate("/")
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className={classes.wrapper}>
            <Toaster/>
            <Paper className={classes.form} radius={0} p={30}>
                <IconArrowBackUp color='white' onClick={() => navigate(-1)} />
                <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
                    Register to Intercom!
                </Title>

                <form onSubmit={submitHandle}>
                    <TextInput type="email" required value={data.email} onChange={e => setData((data: any) => ({ ...data, email: e.target.value }))} label="Email address" placeholder="hello@gmail.com" size="md" />
                    <TextInput required value={data.name} onChange={e => setData((data: any) => ({ ...data, name: e.target.value }))} label="Fullname" placeholder="John Doe" size="md" mt="md" />
                    <PasswordStrength data={data} setData={setData} />
                    <Button disabled={disabled} type='submit' fullWidth mt="xl" size="md">
                        Register
                    </Button>
                </form>

                <Text ta="center" mt="md">
                    Have an account ?{' '}
                    <Anchor<'a'> href="/auth/login" weight={700}>
                        Login
                    </Anchor>
                </Text>
            </Paper>
        </div>
    );
}