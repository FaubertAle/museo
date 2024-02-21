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

#define PI 3.14159265359

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float sdfCircle(vec2 p, vec2 o, float r){
	return length(p-o)-r;
}

float oLine2d(vec2 p, vec2 A, vec2 B){
	vec2 AB = B-A;
	vec2 Ap = p-A;
	return -sign((AB.x*Ap.y)-(Ap.x*AB.y));
}


float sdfLine(vec2 p, vec2 a, vec2 b){
	vec2 ab = b-a;
	vec2 ap = p-a;
	float t = dot(ab, ap)/dot(ab, ab);
	t= clamp(t, 0., 1.);
	vec2 c = a+t*ab;
	return length(p-c);
}

float sdfCapsule(vec2 p, vec2 a, vec2 b, float r){
	float l = sdfLine(p, a, b);
	return l-r;
}

float radialGrad(vec2 p, vec2 o, float n){
	vec2 pos = p-o;
	float pt = atan(-pos.y, pos.x);
	pt = (pt + PI/2.)/(2.*PI);
	float fr = fract(n*pt);
	float id = pt>=0.? floor(n*pt): n+floor(n*pt);
	// if (n == 1.) return id;
	// return id*(1./(n-1.));
	return id;
}

float sdfPolygon(vec2 p, vec2 o, float R, float n, bool fill){
	float id = radialGrad(p, o, n);

	float dirA = id*2.*PI/n;
	vec2 A = o + R*vec2(sin(dirA), cos(dirA));
	float dirB = (id+1.0)*2.*PI/n;
	vec2 B = o + R*vec2(sin(dirB), cos(dirB));
	if (fill) return sdfLine(p, A, B)*-oLine2d(p, A, B);
	return sdfLine(p, A, B);
}


float sdfRPolyC(vec2 p, vec2 o, float R, float n){
	float id = radialGrad(p, o, n);

	float dirA = id*2.*PI/n;
	vec2 A = o + R*vec2(sin(dirA), cos(dirA));
	float dirB = (id+1.0)*2.*PI/n;
	vec2 B = o + R*vec2(sin(dirB), cos(dirB));

	vec2 mAB = (A+B)/2.;
	float dM = length(B-A);

	return sdfCircle(p, mAB, dM);
}

float sdfNStar(vec2 p, vec2 o, float R, float r, float n, bool fill){
	float id = radialGrad(p, o, n);

	float dirA = id*2.*PI/n;
	vec2 A = o + R*vec2(sin(dirA), cos(dirA));
	float dirC = (id+.5)*2.*PI/n;
	vec2 C = o + r*vec2(sin(dirC), cos(dirC));
	float dirB = (id+1.0)*2.*PI/n;
	vec2 B = o + R*vec2(sin(dirB), cos(dirB));
	float L1 = sdfLine(p, A, C);
	float L2 = sdfLine(p, C, B);
	if (fill) return min(L1*-oLine2d(p, A, C), L2*-oLine2d(p, C, B));
	return min(L1, L2);
}

vec2 screenN (vec2 res) {
	float asp = res.x/res.y;
	vec2 aux = vec2((vUv.x-.5)*asp, vUv.y-.5)*2.; 
	return aux;
}

float getDist(vec2 p){
	float star = sdfNStar(p, vec2(0.), 0.8, 0.5, 5., false);
	float pol =  sdfRPolyC(p, vec2(0.), 0.4, 5.);
	return star;
}

void main()	{
	vec2 p = screenN(u_resolution);
	vec3 col = vec3(0.);
    vec2 A = vec2(0.);
    float val = getDist(p);
	// float val = sdfM2(p, A, 0.4, 5.);
	// float val = radialGrad(p, A, 5.);
	// col = vec3(val);
	col = val > 0.? 
		mix(vec3(.93, .54, .06), vec3(.27, .73, .92), abs(2.5*cos(10.*val-u_time/8.))): 
		vec3(.93, .54, .06)*(.7-4.*val);
	col = mix(vec3(1.), col, smoothstep(0., 0.05, val));
	gl_FragColor = vec4(col ,1.0 );
}
`;

export {vertexShader, fragmentShader};