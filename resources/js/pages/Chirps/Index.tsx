import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, chirps }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/chirps', {
            onSuccess: () => reset(),
        });
    }

    return (
        <AppLayout>
            <Head title="Chirps" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                    <textarea
                        value={data.message}
                        placeholder="What's on your mind?"
                        className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        onChange={e => setData('message', e.target.value)}
                    ></textarea>
                    {errors.message && <div className="text-red-500 mt-1">{errors.message}</div>}
                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                    >
                        Chirp!
                    </button>
                </form>

                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    {chirps.map(chirp => (
                        <Chirp key={chirp.id} chirp={chirp} auth={auth} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

function Chirp({ chirp, auth }) {
    const [editing, setEditing] = useState(false);

    const { data, setData, patch, delete: destroy, processing, reset, errors } = useForm({
        message: chirp.message,
    });

    function submitEdit(e) {
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
        <div className="p-6 flex space-x-2">
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">{chirp.user.name}</span>
                    <small className="text-gray-500 ml-2">{new Date(chirp.created_at).toLocaleString()}</small>
                </div>

                {editing ? (
                    <form onSubmit={submitEdit} className="mt-2">
                        <textarea
                            value={data.message}
                            onChange={e => setData('message', e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
                        ></textarea>
                        {errors.message && <div className="text-red-500 mt-1">{errors.message}</div>}
                        <div className="mt-2 space-x-2">
                            <button type="submit" disabled={processing} className="px-3 py-1 bg-indigo-500 text-white rounded">
                                Guardar
                            </button>
                            <button type="button" onClick={() => { setEditing(false); reset(); }} className="px-3 py-1 bg-gray-200 rounded">
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="mt-2 text-gray-900">{chirp.message}</p>
                )}

                {auth.user.id === chirp.user_id && !editing && (
                    <div className="mt-2 space-x-2">
                        <button onClick={() => setEditing(true)} className="text-sm text-indigo-500 hover:underline">
                            Editar
                        </button>
                        <button onClick={deleteChirp} className="text-sm text-red-500 hover:underline">
                            Eliminar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
