import React, { useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
    color: "",
    code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
    console.log(colors);
    const [editing, setEditing] = useState(false);
    const [colorToEdit, setColorToEdit] = useState(initialColor);
    const [newColor, setNewColor] = useState({
        color: "",
        code: {
            hex: ""
        }
    });

    const editColor = color => {
        setEditing(true);
        setColorToEdit(color);
    };

    const saveEdit = e => {
        e.preventDefault();
        // Make a put request to save your updated color
        // think about where will you get the id from...
        // where is is saved right now?
        axiosWithAuth()
            .put(`/colors/${colorToEdit.id}`, colorToEdit)
            .then(res => {
                const colorIndex = colors.findIndex(
                    color => color.id === colorToEdit.id
                );
                let updatedColors = [...colors];

                if (colorIndex > -1) {
                    const color = { ...colors[colorIndex], ...res.data };

                    updatedColors = [
                        ...colors.slice(0, colorIndex),
                        color,
                        ...colors.slice(colorIndex + 1)
                    ];
                }

                updateColors(updatedColors);
                setEditing(false);
            })
            .catch(err => console.log("Error editing color: ", err));
    };

    const deleteColor = color => {
        // make a delete request to delete this color
        axiosWithAuth()
            .delete(`/colors/${color.id}`, color)
            .then(res => {
                const colorIndex = colors.findIndex(c => c.id === color.id);

                let updatedColors = [...colors];

                if (colorIndex > -1) {
                    updatedColors.splice(colorIndex, 1);
                }

                updateColors(updatedColors);
            })
            .catch(err => console.log("Error deleting color: ", err));
    };

    const handleNewColorChange = e => {
        setNewColor({
            ...newColor,
            [e.target.name]: e.target.value
        });
    };

    // couldn't figure out how to make one dynamic handleChange function that could handle the nested `code` object inside of `newColor`
    const handleNewColorHexChange = e => {
        setNewColor({
            ...newColor,
            code: {
                [e.target.name]: e.target.value
            }
        });
    };

    const handleSubmitNewColor = e => {
        e.preventDefault();

        axiosWithAuth()
            .post("/colors", newColor)
            .then(res => {
                updateColors(res.data);
                setNewColor({
                    color: "",
                    code: {
                        hex: ""
                    }
                });
            })
            .catch(err => console.log("Error adding new color: ", err));
    };

    return (
        <div className="colors-wrap">
            <p>colors</p>
            <ul>
                {colors.map(color => (
                    <li key={color.color} onClick={() => editColor(color)}>
                        <span>
                            <span
                                className="delete"
                                onClick={e => {
                                    e.stopPropagation();
                                    deleteColor(color);
                                }}
                            >
                                x
                            </span>{" "}
                            {color.color}
                        </span>
                        <div
                            className="color-box"
                            style={{ backgroundColor: color.code.hex }}
                        />
                    </li>
                ))}
            </ul>
            {editing && (
                <form onSubmit={saveEdit}>
                    <legend>edit color</legend>
                    <label>
                        color name:
                        <input
                            onChange={e =>
                                setColorToEdit({
                                    ...colorToEdit,
                                    color: e.target.value
                                })
                            }
                            value={colorToEdit.color}
                        />
                    </label>
                    <label>
                        hex code:
                        <input
                            onChange={e =>
                                setColorToEdit({
                                    ...colorToEdit,
                                    code: { hex: e.target.value }
                                })
                            }
                            value={colorToEdit.code.hex}
                        />
                    </label>
                    <div className="button-row">
                        <button type="submit">save</button>
                        <button onClick={() => setEditing(false)}>
                            cancel
                        </button>
                    </div>
                </form>
            )}
            <div className="spacer" />
            {/* stretch - build another form here to add a color */}
            <form onSubmit={handleSubmitNewColor}>
                <label htmlFor="newColorName">color name: </label>
                <input
                    id="newColorName"
                    name="color"
                    type="text"
                    value={newColor.color}
                    onChange={handleNewColorChange}
                />
                <label htmlFor="newColorHex">hex code: </label>
                <input
                    id="newColorHex"
                    name="hex"
                    type="text"
                    value={newColor.code.hex}
                    onChange={handleNewColorHexChange}
                />
                <button type="submit">Add color</button>
            </form>
        </div>
    );
};

export default ColorList;
