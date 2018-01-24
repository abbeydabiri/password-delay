until ./appPasswordDelay_linux.elf; do
    echo "Server 'appPasswordDelay_linux.elf' crashed with exit code $?.  Respawning.." >&2
    sleep 30
done

