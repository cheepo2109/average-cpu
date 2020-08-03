#!/bin/bash
#sometimes cpu needs some time to go above average,
#so giving it extra seconds
duration=200  # seconds
#instances=8  # cpus
instances=$([ $(uname) = 'Darwin' ] && 
                       sysctl -n hw.logicalcpu_max || 
                       lscpu -p | egrep -v '^#' | wc -l)
endtime=$(($(date +%s) + $duration))
echo "Starting CPU load 🚀"
for ((i=0; i<instances; i++))
do
    while (($(date +%s) < $endtime)); do :; done &
done

