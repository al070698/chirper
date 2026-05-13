import { type FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import type { Auth, User } from '@/types';

type ChirpType = {
    id: number;
    user_id: number;
    message: string;
    created_at: string;
    user: User;
};

type IndexProps = {
    auth: Auth;
    chirps: ChirpType[];
};

type ChirpProps = {
    chirp: ChirpType;
    auth: Auth;
};

export default function Index({ auth, chirps }: IndexProps) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post('/chirps', {
            onSuccess: () => reset(),
        });
    }

    return (
        <>
            <Head title="Chirps" />

            <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                    <textarea
                        value={data.message}
                        placeholder="What's on your mind?"
                        className="focus:ring-opacity-50 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                        onChange={(e) => setData('message', e.target.value)}
                    ></textarea>

                    {errors.message && (
                        <div className="mt-1 text-red-500">
                            {errors.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-4 rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600"
                    >
                        Chirp!
                    </button>
                </form>

                <div className="mt-6 divide-y rounded-lg bg-white shadow-sm">
                    {chirps.map((chirp) => (
                        <Chirp
                            key={chirp.id}
                            chirp={chirp}
                            auth={auth}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

function Chirp({ chirp, auth }: ChirpProps) {
    const [editing, setEditing] = useState(false);

    const {
        data,
        setData,
        patch,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        message: chirp.message,
    });

    function submitEdit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        patch(`/chirps/${chirp.id}`, {
            onSuccess: () => setEditing(false),
        });
    }

    function deleteChirp() {
        if (confirm('¿Seguro que quieres eliminar este Chirp?')) {
            destroy(`/chirps/${chirp.id}`);
        }
    }

    return (
        <div className="flex space-x-2 p-6">
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">
                        {chirp.user.name}
                    </span>

                    <small className="ml-2 text-gray-500">
                        {new Date(chirp.created_at).toLocaleString()}
                    </small>
                </div>

                {editing ? (
                    <form onSubmit={submitEdit} className="mt-2">
                        <textarea
                            value={data.message}
                            onChange={(e) =>
                                setData('message', e.target.value)
                            }
                            className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm"
                        ></textarea>

                        {errors.message && (
                            <div className="mt-1 text-red-500">
                                {errors.message}
                            </div>
                        )}

                        <div className="mt-2 space-x-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-indigo-500 px-3 py-1 text-white"
                            >
                                Guardar
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    reset();
                                }}
                                className="rounded bg-gray-200 px-3 py-1"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="mt-2 text-gray-900">
                        {chirp.message}
                    </p>
                )}

                {auth.user.id === chirp.user_id && !editing && (
                    <div className="mt-2 space-x-2">
                        <button
                            onClick={() => setEditing(true)}
                            className="text-sm text-indigo-500 hover:underline"
                        >
                            Editar
                        </button>

                        <button
                            onClick={deleteChirp}
                            className="text-sm text-red-500 hover:underline"
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}