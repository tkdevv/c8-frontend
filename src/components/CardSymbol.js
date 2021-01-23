import React from "react";

const CardSymbol = ({ symbol }) => {
  const redFill = "#ff1111";
  const blackFill = "#000";
  const symbolWidth = "100px";
  const symbolHeight = "120px";

  return (
    <div>
      {symbol === "S" && (
        <div className="card-symbol-container">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="270.000000pt"
            height="170.000000pt"
            viewBox="0 0 155.000000 105.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(-58.000000,133.000000) scale(0.100000,-0.100000)"
              fill={blackFill}
              stroke="none"
            >
              <path
                d="M1300 1637 c-61 -81 -155 -166 -323 -293 -261 -199 -351 -310 -378
-468 -13 -80 -6 -190 17 -244 59 -143 182 -208 378 -200 86 3 110 8 158 31 31
15 73 46 94 69 l37 41 -7 -79 c-27 -295 -103 -417 -301 -480 -34 -11 24 -13
370 -13 346 0 404 2 370 13 -196 62 -277 189 -301 473 l-7 83 49 -49 c75 -74
139 -94 285 -89 107 4 122 7 182 36 74 37 109 73 144 149 48 103 39 273 -19
393 -41 84 -148 191 -334 332 -172 131 -262 213 -323 293 l-46 62 -45 -60z"
              />
            </g>
          </svg>
        </div>
      )}

      {symbol === "C" && (
        <div className="card-symbol-container">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width={"573.000000pt"}
            height="600.000000pt"
            viewBox="0 0 573.000000 600.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(-35.000000,670.000000) scale(0.113000,-0.12000)"
              fill={blackFill}
              stroke="none"
            >
              <path
                d="M2625 5656 c-332 -52 -604 -254 -739 -548 -86 -186 -131 -409 -123
-613 5 -159 20 -209 123 -426 41 -86 74 -164 74 -173 0 -21 -21 -16 -165 40
-164 64 -303 88 -510 88 l-170 1 -79 -34 c-228 -99 -464 -330 -584 -575 -67
-135 -90 -216 -103 -356 -14 -149 0 -307 36 -417 37 -110 138 -303 206 -393
207 -275 541 -440 889 -440 304 0 618 125 877 348 110 96 195 197 329 397 65
96 121 172 126 169 11 -7 10 -145 -2 -299 -21 -260 -77 -463 -185 -680 -76
-153 -161 -275 -280 -402 -191 -205 -355 -303 -655 -391 -58 -17 -168 -49
-245 -72 -175 -51 -260 -91 -281 -132 -8 -16 -13 -33 -10 -36 26 -25 3313 -29
3389 -4 47 16 49 42 5 86 -29 28 -52 37 -188 70 -203 50 -418 117 -530 165
-432 186 -764 625 -865 1142 -33 170 -65 421 -65 511 0 89 1 88 120 -87 109
-162 185 -258 276 -349 283 -285 664 -449 1004 -433 275 13 528 126 733 325
104 102 165 188 240 338 87 173 92 199 92 474 0 265 -4 291 -79 459 -142 324
-383 534 -706 617 -57 14 -109 19 -215 18 -190 0 -237 -12 -514 -134 -51 -22
-96 -38 -99 -35 -9 8 13 64 88 225 96 205 112 261 117 406 13 315 -98 635
-292 843 -162 173 -374 280 -620 310 -116 14 -318 12 -420 -3z"
              />
            </g>
          </svg>
        </div>
      )}

      {symbol === "H" && (
        <div className="card-symbol-container">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="256.000000pt"
            height="256.000000pt"
            viewBox="0 0 256.000000 256.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(3.000000,256.000000) scale(0.097500,-0.100000)"
              fill={redFill}
              stroke="none"
            >
              <path
                d="M595 2550 c-145 -27 -271 -94 -381 -204 -90 -90 -143 -175 -182 -294
-22 -67 -26 -94 -25 -212 0 -119 3 -144 26 -215 34 -104 88 -194 179 -303 41
-48 296 -363 567 -700 271 -336 497 -612 501 -612 4 0 230 276 501 612 271
337 526 652 567 700 91 109 145 199 179 303 23 71 26 96 26 215 1 118 -3 145
-25 212 -39 119 -92 204 -182 294 -90 90 -175 143 -294 182 -67 22 -94 26
-212 26 -118 0 -145 -4 -212 -26 -108 -36 -199 -89 -279 -165 l-69 -65 -69 65
c-131 123 -281 186 -461 192 -58 2 -127 0 -155 -5z"
              />
            </g>
          </svg>
        </div>
      )}

      {symbol === "D" && (
        <div className="card-symbol-container">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="743.000000pt"
            height="1024.000000pt"
            viewBox="0 0 743.000000 1024.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(-55.000000,1000.000000) scale(0.115000,-0.093000)"
              fill={redFill}
              stroke="none"
            >
              <path
                d="M3640 9629 c-63 -75 -134 -181 -275 -409 -499 -803 -1514 -2181
-2415 -3275 -250 -304 -360 -449 -360 -476 0 -25 216 -309 675 -889 580 -732
1041 -1344 1546 -2055 371 -521 518 -741 720 -1080 76 -126 144 -238 151 -249
12 -16 29 6 177 243 547 877 1443 2129 2206 3081 166 207 414 507 679 820 58
69 105 130 103 137 -1 6 -126 159 -277 340 -426 507 -639 775 -1081 1358 -598
789 -954 1291 -1512 2130 -139 209 -259 381 -269 383 -10 2 -36 -20 -68 -59z"
              />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};

export default CardSymbol;
