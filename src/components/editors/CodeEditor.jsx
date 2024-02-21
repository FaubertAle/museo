import { useState, useRef } from "react";
import Editor from '@monaco-editor/react';
import { ToggleButton } from "../buttons/ToggleButton";

export function CodeEditor({data}){
    const [code, setCode] = useState(false);
    

    const editorOptions = {
        selectOnLineNumbers: true,
        readOnly: true,
    };

    return(<>
        <div className={!code? 'editor-container': 'editor-container active'}>
            <Editor
            height="100%"
            width="100%"
            theme="vs-dark"
            defaultLanguage="cpp" 
            defaultValue={data}
            options={editorOptions}
            className="editor"
            />
        </div>
        <ToggleButton name={'code'} action={()=>setCode(!code)} text={false}/>
    </>
        

    );
}