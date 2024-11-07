import React, { useState } from "react";
import HeaderDentist from "../../components/dentist/HeaderDentist";

export default function VisitsDentist() {
    const [formData, setFormData] = useState({
        fecha: "",
        codigoCedula: "",
        nombre: "",
        planArea: "",
        motivo: "",
        descripcion: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí agregarías la lógica para enviar los datos del formulario al backend
        console.log(formData);
    };

    return (
        <div style={{ marginTop: "80px" }}>
            <HeaderDentist />
            <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
                <h2 style={{ textAlign: "center", color: "#d32f2f", fontSize: "24px", fontWeight: "bold" }}>Registro de visitas</h2>
                <p style={{ textAlign: "center", color: "#555", fontSize: "16px", marginBottom: "20px" }}>
                    Aquí se podrán registrar las visitas de usuarios al servicio
                </p>
                <form 
                    onSubmit={handleSubmit} 
                    style={{ 
                        background: "#fff", 
                        padding: "30px", 
                        borderRadius: "12px", 
                        boxShadow: "0px 8px 24px rgba(0,0,0,0.15)", 
                        display: "flex", 
                        flexDirection: "column",
                        gap: "20px"
                    }}
                >
                    <div style={{ display: "flex", gap: "20px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: "500", color: "#333" }}>Fecha</label>
                            <input 
                                type="date" 
                                name="fecha" 
                                value={formData.fecha} 
                                onChange={handleChange} 
                                required 
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: "500", color: "#333" }}>Código/cédula</label>
                            <div style={{ display: "flex" }}>
                                <input 
                                    type="text" 
                                    name="codigoCedula" 
                                    placeholder="Código/cédula paciente" 
                                    value={formData.codigoCedula} 
                                    onChange={handleChange} 
                                    required 
                                    style={{ flex: 1, padding: "10px", borderRadius: "8px 0 0 8px", border: "1px solid #ccc" }}
                                />
                                <button 
                                    type="button" 
                                    style={{ 
                                        padding: "10px", 
                                        backgroundColor: "#e0e0e0", 
                                        color: "#555", 
                                        border: "1px solid #ccc", 
                                        borderRadius: "0 8px 8px 0", 
                                        cursor: "pointer" 
                                    }}
                                >
                                    🔎
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "20px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: "500", color: "#333" }}>Nombre</label>
                            <input 
                                type="text" 
                                name="nombre" 
                                placeholder="Nombre del paciente" 
                                value={formData.nombre} 
                                onChange={handleChange} 
                                required 
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: "500", color: "#333" }}>Plan/área dependencia</label>
                            <input 
                                type="text" 
                                name="planArea" 
                                placeholder="Plan/área dependencia" 
                                value={formData.planArea} 
                                onChange={handleChange} 
                                required 
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontWeight: "500", color: "#333" }}>Motivo</label>
                        <select 
                            name="motivo" 
                            value={formData.motivo} 
                            onChange={handleChange} 
                            required 
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                        >
                            <option value="">Seleccione</option>
                            <option value="ayudas_diagnosticas">Ayudas diagnósticas</option>
                            <option value="formulacion_medicamentos">Formulación de medicamentos</option>
                            <option value="higiene_oral">Higiene oral</option>
                            <option value="remision_dependencias">Remisión a otras dependencias</option>
                            <option value="resina_fotocurado">Resina de fotocurado</option>
                            <option value="revaloracion">Revaloración</option>
                            <option value="urgencia_odontologica">Urgencia odontológica</option>
                            <option value="valoracion_primera_vez">Valoración primera vez</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontWeight: "500", color: "#333" }}>Descripción de la visita</label>
                        <textarea 
                            name="descripcion" 
                            placeholder="Descripción de la visita" 
                            value={formData.descripcion} 
                            onChange={handleChange} 
                            required 
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", minHeight: "100px" }}
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                        <button 
                            type="submit" 
                            style={{ 
                                padding: "12px 30px", 
                                backgroundColor: "#d32f2f", 
                                color: "#fff", 
                                border: "none", 
                                borderRadius: "8px", 
                                cursor: "pointer", 
                                fontWeight: "500"
                            }}
                        >
                            Guardar
                        </button>
                        <button 
                            type="button" 
                            style={{ 
                                padding: "12px 30px", 
                                backgroundColor: "#f8f8f8", 
                                color: "#d32f2f", 
                                border: "1px solid #d32f2f", 
                                borderRadius: "8px", 
                                cursor: "pointer", 
                                fontWeight: "500"
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
