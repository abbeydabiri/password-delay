until ./appPDIA_linux.elf; do
    echo "Server 'appPDIA_linux.elf' crashed with exit code $?.  Respawning.." >&2
    sleep 30
done

