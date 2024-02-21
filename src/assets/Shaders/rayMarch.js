const vertexShader = `
varying vec2 vUv;

void main(){
	vUv = uv;
	gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform bool u_clic;
uniform vec2 u_pointer;

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001
#define TAU 6.283185
#define PI 3.14159265359

//funciones de cálculo
mat2 Rot(float a) {
    float s=sin(a), c=cos(a);
    return mat2(c, -s, s, c);
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

//funciones de distancia

float sdfBox( vec3 p, vec3 o, vec3 s ){
    vec3 pos = p-o;
    pos.xz*= Rot(u_time/15.);
	return length(max(abs(pos)-s, 0.));
}

float sdfSphere(vec3 p, vec3 o, float r){
	return length(p-o)-r;
}

//funciones de render 
float GetDist(vec3 p) {
    float d = sdfBox(p, vec3(0.), vec3(.8));
    float s = sdfSphere(p, vec3(0.), 1.);
    return smin(d,s, 0.1);
}

float RayMarch(vec3 ro, vec3 rd) {
	float dO=0.;
    
    for(int i=0; i<MAX_STEPS; i++) {
    	vec3 p = ro + rd*dO;
        float dS = GetDist(p);
        dO += dS;
        if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
    }
    
    return dO;
}

vec3 GetNormal(vec3 p) {
    vec2 e = vec2(.001, 0);
    vec3 n = GetDist(p) - 
        vec3(GetDist(p-e.xyy), GetDist(p-e.yxy),GetDist(p-e.yyx));
    
    return normalize(n);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 
        f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = f*z,
        i = c + uv.x*r + uv.y*u;
    return normalize(i);
}

vec2 screenN (vec2 uv,vec2 res) {
	float asp = res.x/res.y;
	vec2 aux = vec2((uv.x-.5)*asp, uv.y-.5)*2.; 
	return aux;
}

void main()	{
	vec2 p = screenN(vUv ,u_resolution);
	// vec2 m = screenN(u_pointer, u_resolution);
	// vec3 col = vec3(0.);

    vec3 ro = vec3(0, 0, -2.5);
    // ro.yz *= Rot(-m.y*PI);
    // ro.xz *= Rot(-m.x*TAU);
    
    // vec3 rd = GetRayDir(p, ro, vec3(0,0.,0), 1.);
    vec3 rd = normalize(vec3(p, 1.));

    vec3 col = vec3(0);
   
    float d = RayMarch(ro, rd);

    if(d<MAX_DIST) {
        vec3 p = ro + rd * d;
        vec3 n = GetNormal(p);
        vec3 r = reflect(rd, n);

        float dif = dot(n, normalize(vec3(1,2,3)))*.5+.5;
        col = vec3(dif);
    }
    
    col = pow(col, vec3(.4545));	// gamma correction

	gl_FragColor = vec4(col ,1.0 );
}
`;

export {vertexShader, fragmentShader};