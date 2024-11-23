import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// Inicializamos una instancia de Axios
const api = axios.create({
    headers: {
        "Content-Type": "application/json",
        'Accept': "application/json",
    },
});

// Cargar env.json y configurar baseURL dinámicamente
export const loadConfig = async () => {
    let storedBaseURL = false;
    
    try {
        let response = null
        if(storedBaseURL){
            response = await fetch("/env.json");
            storedBaseURL = true
        }
        const config = await response.json(); // Lee el JSON una vez
        console.log(config); // Ahora puedes imprimirlo aquí si lo necesitas
        api.defaults.baseURL = config.API; // Establecemos baseURL dinámicamente
        console.log(config.API);
    } catch (error) {
        console.error("Error loading env.json:", error);
        throw new Error("Failed to load API configuration");
    }
};
// Llamamos a loadConfig inmediatamente para inicializar 

// Configurar interceptores de Axios
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;