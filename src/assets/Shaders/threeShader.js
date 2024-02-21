const vertexShader = `
varying vec2 vUv;

void main(){
	vUv = uv;
	gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float time;
uniform vec2 resolution;

float sdfCircle(vec2 p, vec2 o, float r){
	return length(p-o)-r;
}

float sdfCapsule(vec2 p, vec2 a, vec2 b, float r){
	vec2 ab = b-a;
	vec2 ap = p-a;
	float t = dot(ab, ap)/dot(ab, ab);
	t= clamp(t, 0., 1.);
	vec2 c = a+t*ab;
	return length(p-c)-r;
}

vec2 screenN (vec2 res) {
	float asp = res.x/res.y;
	vec2 aux = vec2((vUv.x-.5)*asp, vUv.y-.5)*2.; 
	return aux;
}

void main()	{
	vec2 p = screenN(resolution);
	vec3 col = vec3(0.);
    // col += vec3(step(abs(p.y), .005));
    // float circle = sdfCircle(p, vec2(0., 0.), .8)>0.? 0.: 1.;
    vec2 A = vec2(-1., 0.); vec2 B = vec2(1., 0.);
    float val =  sdfCapsule(p, A, B, .25);
    float fig = val>0.? cos(val*60. +time): 1.+val*5.;
    col += vec3(.9, 0., 1.)*fig;
	gl_FragColor = vec4(col ,1.0 );
}
`;

export {vertexShader, fragmentShader};