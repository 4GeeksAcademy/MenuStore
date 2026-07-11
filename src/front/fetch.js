
const urlApi = "https://animated-memory-5g4qw67xgjjrh44xp-3001.app.github.dev/"

export const fetchRegister = async (userData) => {
        try{    
            const response = await fetch(`${urlApi}api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            const data = await response.json();
            console.log('Registro exitoso:', data);

        } catch (error) {
            console.error('Error al registrar usuario:', error);
        }
    };