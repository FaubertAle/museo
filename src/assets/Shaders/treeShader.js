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

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST 0.01

mat2 Rot(float a) {
    float s=sin(a), c=cos(a);
    return mat2(c, -s, s, c);
}

// Funciones de distancia para diferentes figuras
float sdfCircle(vec2 p, vec2 o, float r){
	return length(p-o)-r;
}
float sdfSphere(vec3 p, vec3 o, float r){
	return length(p-o)-r;
}

float sdfCapsule(vec3 p, vec3 a, vec3 b, float r){
	vec3 ab = b-a;
	vec3 ap = p-a;
	float t = dot(ab, ap)/dot(ab, ab);
	t= clamp(t, 0., 1.);
	vec3 c = a+t*ab;
	return length(p-c)-r;
}

float sdfTorus(vec3 p, vec3 o, float Ra, float Rb){
	float x = length((p-o).xz)-Ra;
	return length(vec2(x, (p-o).y))-Rb;
}

float sdfBox( vec3 p, vec3 o, vec3 s ){
	return length(max(abs(p-o)-s, 0.))-0.1;
}

float sdfBoxFrame( vec3 p, vec3 o, vec3 b, float e )
{
	vec3 dP = p-o;
	// dP.xy *= Rot(time/20.);
	dP.xz *= Rot(3.1415*cos(time/20.));
	p = abs(dP)-b;
  	vec3 q = abs(p+e)-e;
  	return min(min(
      	length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
      		length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
      		length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
}

// Funcion que verifica la distancia a la Escena
float getDist(vec3 p){
	float Sphere = sdfSphere(p, vec3(0., 2.5, 5.), 1.);
	float Plane = p.y;
	float Capsule =  sdfCapsule(p, vec3(-1., 4., 5.), vec3(1., 4., 5.), .5);
	float Torus = sdfTorus(p, vec3(0., 1., 5.), 1.5, .3);
	float Box = sdfBox(p, vec3(-2.5, 2., 4.), vec3(.5, .5, .5));
	float BoxFrame = sdfBoxFrame(p, vec3(0, 4., 4.), vec3(.8, .8, .8), .1);
	float dist = min(Sphere, Plane);
	dist = min(dist, Capsule);
	dist = min(dist, Torus);
	dist = min(dist, Box);
	dist = min(dist, BoxFrame);
	
	return dist;
}

float RayMarch(vec3 ro, vec3 rd){
	float dO = 0.;
	for(int i=0; i<MAX_STEPS; i++){
		vec3 p = ro + rd*dO;
		float dS = getDist(p);
		dO+=dS;
		if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
	}
	return dO;
}

vec3 getNormal(vec3 p){
	float d = getDist(p);
	vec2 e = vec2(0.01, 0.);
	vec3 n = d - vec3(
		getDist(p - e.xyy),
		getDist(p - e.yxy),
		getDist(p - e.yyx)
	);
	return normalize(n);
}

float getLight(vec3 p){
	vec3 lightPos = vec3(4.*cos(time/25.), 10., 3.);
	// vec3 lCol = vec3(1., 0., 0.);
	vec3 ld = normalize(lightPos-p);
	vec3 n = getNormal(p);
	float diff = clamp(dot(n, ld), 0., 1.);

	//calculo de sombra
	float d = RayMarch(p+n*SURF_DIST*2., ld);
	if(d<length(lightPos-p)) diff*=.1; 
	return diff;
}

vec2 screenN (vec2 res) {
	float asp = res.x/res.y;
	vec2 aux = vec2((vUv.x-.5)*asp, vUv.y-.5)*2.; 
	return aux;
}
void main()	{
	
	vec2 p = screenN(resolution);
	float t = time;
	vec3 col = vec3(0);

	vec3 ro = vec3(0., 4., -1.);
	// vec3 lookAt = vec3(0., 0., 6.);
	// float zoom = 1.;
	// vec3 f = normalize(lookAt - ro);
	// vec3 r = cross(vec3(0., 1., 0.), f);
	// vec3 u = cross(f, r);
	// vec3 c = ro+f*zoom;
	// vec3 i = c + p.x*r + p.y*u; 

	//vec3 rd = i-ro;
	vec3 rd = normalize(vec3(p, 1.));
	float dr = RayMarch(ro, rd);
	vec3 point = ro + rd*dr;
	float diffuse =  getLight(point);
	col = vec3(diffuse);
	gl_FragColor = vec4(col, 1.);
}
`;

export {vertexShader, fragmentShader};
