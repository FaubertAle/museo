const vertexShader = `
varying vec2 vUv;

void main(){
	vUv = uv;
	gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0);
}
`;

const customUniforms = 
`#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;
uniform bool u_clic;
uniform vec2 u_pointer;
`;

const customFunctions =
`
vec2 screenN (vec2 uv,vec2 res) {
	float asp = res.x/res.y;
	vec2 aux = vec2((uv.x-.5)*asp, uv.y-.5)*2.; 
	return aux;
}

vec2 id(vec2 p, vec2 res){
	p*=res;
	vec2 id = floor(p);
	id = id/(res-1.);
	return id;
}

`;


const shaderBasics = {
	vertex: vertexShader,
	uniforms: customUniforms,
	functions: customFunctions,
}

export { shaderBasics };