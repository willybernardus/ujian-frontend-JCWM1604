import React from 'react';
import Loader from "react-loader-spinner";

// untuk loading bikin function component aja, karena kita tidak perlu state
function Loading() {

    return (
        <div style={{ height: "100vh" }} className="d-flex justify-content-center align-items-center">
            <Loader type="Bars" color="#0D6EFD" height={100} width={100} />
        </div>
    )
}

export default Loading;