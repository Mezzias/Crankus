document.addEventListener(\"DOMContentLoaded\", () => {
    fetch(\"/api/stats\")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById(\"stats-container\");
            data.forEach(stat => {
                const div = document.createElement(\"div\");
                div.textContent = ${stat.nombre}: ;
                container.appendChild(div);
            });
        });
});
