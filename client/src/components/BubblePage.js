import React, { useState, useEffect } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

import Bubbles from "./Bubbles";
import ColorList from "./ColorList";

const BubblePage = () => {
    const [colorList, setColorList] = useState([]);
    // fetch your colors data from the server when the component mounts
    // set that data to the colorList state property

    const getBubbles = () => {
        axiosWithAuth()
            .get("/colors")
            .then(res => {
                setColorList(res.data);
            })
            .catch(err => console.log("Error getting bubbles: ", err));
    };

    useEffect(() => {
        getBubbles();
    }, []);

    return (
        <>
            <ColorList colors={colorList} updateColors={setColorList} />
            <Bubbles colors={colorList} />
        </>
    );
};

export default BubblePage;
