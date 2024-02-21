const ex1 = {
    glsl: `
    void main()	{//funcion principal de Fragment Shader
        vec2 p = vUv;
        vec3 col = u_clrA/255.;
        gl_FragColor = vec4(col, 1.);//salida de color de Fragment Shader
    }
    `,
    uniforms: [
        {
            name: "u_clrA",
            value: [155, 200, 50],
            propertis: {
                type: 'color',
                integer: true,
                min: 0,
                max: 255, 
                step: 1
            }
        }
    ],
    descript: {
        title: 'Fragment Shader glsl',
        text: `Puedes seleccionar un color y darle al 
        Fragment Shader la instrucción de pintar todos los
        pixels de este color. 
        `
    } 
    
}

const ex2 = {
    glsl: `
    void main()	{
        vec2 p = vUv;
        vec2 id = id(p, vec2(u_horizontal, u_vertical));
        vec3 col = vec3(id, 0.);
    
        gl_FragColor = vec4(col, 1.);//salida de color de Fragment Shader
    }
    `,
    uniforms: [
        {
            name: "u_horizontal",
            value: 30,
            propertis: {
                type: 'range',
                integer: true,
                min: 0,
                max: 200, 
                step: 1
            }
        },
        {
            name: "u_vertical",
            value: 10,
            propertis: {
                type: 'range',
                integer: true,
                min: 0,
                max: 200, 
                step: 1
            }
        },
    
    ],
    descript: {
       title: 'Resolución y Proporción',
       text: `Puedes determinar la resolución de una pantalla
       personalizada, para verificar como influye el valor
       en cada pixel. Por defecto el color Rojo para
       el indice horizontal y Verde para el indice vertical.
        `
    }
}

const ex3 = {
    glsl: `
    vec3 region (vec2 id){ //nueva funcion agregada
        if (id.x == 0. && id.y == 0.) return u_clrA/255.;//input con selector de color
        if (id.x == 0. && id.y == 1.) return u_clrB/255.;//input con selector de color
        if (id.x == 1. && id.y == 0.) return u_clrC;//input con selector de vector (0-1)
        if (id.x == 1. && id.y == 1.) return u_clrD;//input con selector de vector (0-1)
    }
    void main()	{//funcion principal de Fragment Shader
        vec2 p = vUv;
        vec2 id = id(p, vec2(2, 2));
        vec3 col = region(id);
        gl_FragColor = vec4(col, 1.);//salida de color de Fragment Shader
    }
    `,
    uniforms: [
        {
            name: "u_clrA",
            value: [157, 20, 75],
            propertis: {
                type: 'color',
                integer: true,
                min: 0,
                max: 255, 
                step: 1
            }
        },
        {
            name: "u_clrB",
            value: [255, 255, 0],
            propertis: {
                type: 'color',
                integer: true,
                min: 0,
                max: 255, 
                step: 1
            }
        },
        {
            name: "u_clrC",
            value: [1, 0, 0],
            propertis: {
                type: 'vector',
                integer: false,
                min: 0,
                max: 1, 
                step: 0.05
            }
        },
        {
            name: "u_clrD",
            value: [0, 1, 0],
            propertis: {
                type: 'vector',
                integer: false,
                min: 0,
                max: 1, 
                step: .05
            }
        }
    ],
    descript: {
        title: 'Colores glsl',
        text: `Puedes seleccionar un color y verificar a que 
        region de píxels el Fragment Shader asignará
        este color. Una nueva función se ha creado 
        vec3 region(vec2 id) la cuál determina a que región le pertenece
        cada color mediante declaraciones lógicas. Tambien se han creado
        colores de dos maneras distintas, RGB(0-255) y RGB(0-1), para el
        Fragment Shader los valores entre 0-1 son mejor reconocidos
        no se necesita transformarlos como con los valores 0-255.
        `
    } 
}

const ex4 = {
    glsl: `
    float sdfCircle(vec2 p, vec2 o, float r){
        return length(p-o)-r;
    }
    vec3 operadores(vec2 p){
        vec2 po = vec2(0.);
        vec2 pf = po + u_desp; //suma de vectores
        float radio = .5 - u_resta; // resta de números reales
        float circulo = sdfCircle(p, pf, radio);
        return circulo>0.? vec3(.2, .2, .2):(u_clrA/255.)*u_multiplo;
        //Multiplicación y División
    }
    void main()	{//funcion principal de Fragment Shader
        vec2 p = screenN (vUv, u_resolution);//funcion que normaliza y centra el sistema
        vec3 col = operadores(p);
        gl_FragColor = vec4(col, 1.);//salida de color de Fragment Shader
    }
    `,
    uniforms: [
        {
            name: "u_clrA",
            value: [155, 200, 50],
            propertis: {
                type: 'color',
                integer: true,
                min: 0,
                max: 255, 
                step: 1
            }
        },
        {
            name: "u_desp",
            value: [0, 0],
            propertis: {
                type: 'vector',
                integer: false,
                min: -1,
                max: 1, 
                step: 0.05
            }
        },
        {
            name: "u_resta",
            value: 0,
            propertis: {
                type: 'value',
                integer: false,
                min: -1,
                max: 1, 
                step: 0.05
            }
        },
        {
            name: "u_multiplo",
            value: 1,
            propertis: {
                type: 'value',
                integer: false,
                min: 0,
                max: 1, 
                step: 0.05
            }
        }

    ],
    descript: {
        title: 'Operadores Matemáticos glsl',
        text: `glsl es un lenguaje similar a C++
        con un enfoque matemático. Sus operadores
        son iguales a otros lenguajes de programascón,
        "+" suma, "-" resta, "*" multiplicación y "/"
        división, tambien los "()" para agrupar operaciones.
        `
    }    
}

const ex10 = {
    glsl: `

    void main()	{
        vec2 p = vUv;
        gl_FragColor = vec4(vec3(1.), 1.);
    }
    `,
    uniforms: [
        {
            name: "u_clrA",
            value: [155, 200, 50],
            propertis: {
                type: 'color',
                integer: true,
                min: 0,
                max: 255, 
                step: 1
            }
        },
        {
            name: "u_clrB",
            value: [155, 200, 50],
            propertis: {
                type: 'color',
                integer: true,
                min: 0,
                max: 255, 
                step: 1
            }
        },
        {
            name: "u_clrC",
            value: [155, 200, 50],
            propertis: {
                type: 'color',
                integer: true,
                min: 0,
                max: 255, 
                step: 1
            }
        },
        {
            name: "u_clrD",
            value: [155, 200, 50],
            propertis: {
                type: 'color',
                integer: true,
                min: 0,
                max: 255, 
                step: 1
            }
        },
        {
            name: "u_vertical",
            value: 10,
            propertis: {
                type: 'range',
                integer: true,
                min: 0,
                max: 200, 
                step: 1
            }
        },
        {
            name: "u_horizontal",
            value: 30,
            propertis: {
                type: 'range',
                integer: true,
                min: 0,
                max: 200, 
                step: 1
            }
        },
        {
            name: "u_otro",
            value: .6,
            propertis: {
                type: 'value',
                integer: false,
                min: 0,
                max: 1, 
                step: .01
            }
        },
        {
            name: "u_otro2",
            value: .6,
            propertis: {
                type: 'value',
                integer: false,
                min: 0,
                max: 1, 
                step: .01
            }
        },
        {
            name: "u_otro3",
            value: .6,
            propertis: {
                type: 'value',
                integer: false,
                min: 0,
                max: 1, 
                step: .01
            }
        },
        {
            name: "u_otro4",
            value: .6,
            propertis: {
                type: 'value',
                integer: false,
                min: 0,
                max: 1, 
                step: .01
            }
        },
        {
            name: "u_vector",
            value: [100, 100, 50],
            propertis: {
                type: 'vector',
                integer: true,
                min: 0,
                max: 200, 
                step: 1
            }
        },
        {
            name: "u_vector2",
            value: [0.3, .2, .5],
            propertis: {
                type: 'vector',
                integer: true,
                min: 0,
                max: 1, 
                step: 0.01
            }
        },
        {
            name: "u_vector3",
            value: [0.3, .2, .5],
            propertis: {
                type: 'vector',
                integer: true,
                min: 0,
                max: 1, 
                step: 0.01
            }
        },
        {
            name: "u_vector4",
            value: [0.3, .2, .5],
            propertis: {
                type: 'vector',
                integer: true,
                min: 0,
                max: 1, 
                step: 0.01
            }
        },
    ],
    descript: {
        title: 'Uniforms Prueba',
        text: `Estamos probando como va a quedar en la interfaz
            todos los elementos organizados.
        `
    } 
    
}

const group1 = [
    ex1,
    ex2,
    ex3,
    ex4
];

export { group1 };