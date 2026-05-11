def calculate_player_stats(player_data):
    stats = {}

    for player, times in player_data.items():
        total_ms = 0
        completion_count = len(times)
        
        for time_str in times:
            # Split the "MM:SS" format
            minutes, seconds = map(int, time_str.split(':'))
            
            # Convert to milliseconds: (minutes * 60 + seconds) * 1000
            ms = ((minutes * 60) + seconds) * 1000
            total_ms += ms
        
        # Calculate mean for the individual player and round to nearest MS
        if completion_count > 0:
            avg_ms = round(total_ms / completion_count)
        else:
            avg_ms = 0
            
        stats[player] = {
            "average": avg_ms,
            "count": completion_count
        }
            
    return stats

# "Database" based on players in Screenshot 2026-05-09 at 4.07.27 PM.jpg
completions = {
    "Pratham001": ["22:32", "22:35", "27:21", "18:27", "19:53", "15:54", "19:25", "17:19", "17:04", "23:26", "30:56", "16:59", "19:30", "21:00", "39:58", "25:44", "39:50", "26:19"],
    "AneeboAmiibo": ["24:47", "32:59", "22:36", "18:53", "23:15", "23:05", "26:59", "20:45", "42:04", "29:20", "25:16", "25:31", "30:17"],
    "ILieALot": ["28:23"],
    "bozogoofylame": ["14:05", "13:20"],
    "CrouchingPuppy": ["25:41", "44:04"],
    "Hamzxy": []
}

if __name__ == "__main__":
    player_stats = calculate_player_stats(completions)
    
    print(f"{'Player':<15} | {'Avg (ms)':<10} | {'Completions':<12}")
    print("-" * 45)
    for player, data in player_stats.items():
        print(f"{player:<15} | {data['average']:<10} | {data['count']:<12}")