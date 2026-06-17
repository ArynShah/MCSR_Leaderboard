import requests

DB_URL = "https://mcsr-leaderboard-default-rtdb.firebaseio.com"

def calculate_player_stats(player_data):
    stats = {}

    for player, times in player_data.items():
        total_ms = 0
        completion_count = len(times)
        best_ms = float('inf')  # Set initial best to infinity
        
        for time_str in times:
            # Split the "MM:SS" format
            minutes, seconds = map(int, time_str.split(':'))
            
            ms = ((minutes * 60) + seconds) * 1000
            total_ms += ms
            
            # Check and update Personal Best
            if ms < best_ms:
                best_ms = ms
        
        if completion_count > 0:
            avg_ms = round(total_ms / completion_count)
        else:
            avg_ms = 0
            best_ms = 0  # Fallback for players with no completions
            
        stats[player] = {
            "average": avg_ms,
            "count": completion_count,
            "pb": best_ms
        }
            
    return stats

def update_firebase(player_stats):
    print("\nUpdating Firebase...")
    print("-" * 60)
    for player, data in player_stats.items():
        # Firebase keys in the screenshot are lowercase
        player_id = player.lower()
        
        # Target the specific player's node
        url = f"{DB_URL}/players/{player_id}.json"
        
        # Payload containing ONLY the fields we want to update
        payload = {
            "average": data["average"],
            "completions": data["count"],
            "pb": data["pb"]
        }
        
        # Using PATCH updates only the specified fields, leaving elo, etc., intact
        response = requests.patch(url, json=payload)
        
        if response.status_code == 200:
            print(f"✅ Successfully updated {player_id}")
        else:
            print(f"❌ Failed to update {player_id} - Status Code: {response.status_code}")

completions = {
    "bozogoofylame":    ["17:46", "18:41", "17:44", "19:58", "28:55", "23:22", "22:05", "22:09", "40:48", "26:09", "21:24", "29:42", "30:09", "20:07", "20:27", "20:11", "20:07", "27:21", "15:58", "20:44", "22:32", "19:33", "19:23", "18:24", "19:39", "21:58", "23:22", "21:04", "20:04", "17:19", "17:17", "16:37", "15:19", "14:34", "19:36", "19:01", "19:40", "15:41", "15:11", "14:45", "17:19", "23:03", "15:57", "17:19", "19:31", "18:05", "21:35", "20:12", "21:27", "24:44", "20:31", "19:40", "17:25", "19:35", "22:37", "15:59", "18:59", "21:18","15:09", "19:46", "16:33", "14:05", "24:12", "15:59", "17:08", "16:55", "20:10", "17:51", "15:43", "13:06", "18:31", "15:18"],
    "Pratham001":       ["22:32", "22:35", "27:21", "18:27", "19:53", "15:54", "19:25", "17:19", "17:04", "23:26", "30:56", "16:59", "19:30", "21:00", "39:58", "25:44", "39:50", "26:19", "16:28", "16:36","19:07", "18:42", "18:07", "19:26", "19:07", "18:11", "20:11", "39:27"],
    "AneeboAmiibo":     ["24:47", "32:59", "22:36", "18:53", "23:15", "23:05", "26:59", "20:45", "42:04", "29:20", "25:16", "25:31", "30:17"],
    "ILieALot":         ["28:23", "33:19", "31:14", "24:58", "24:55", "19:59", "17:41"],
    "CrouchingPuppy":   ["25:41", "44:04", "22:17", "34:34", "28:03","21:25", "27:49", "26:03"],
    "NeatFoot":         [],
    "A1sauces":         [],
    "Hamzxy":           []
}

if __name__ == "__main__":
    player_stats = calculate_player_stats(completions)
    
    # Updated table to include PB
    print(f"{'Player':<15} | {'Avg (ms)':<10} | {'PB (ms)':<10} | {'Completions':<12}")
    print("-" * 60)
    for player, data in player_stats.items():
        print(f"{player:<15} | {data['average']:<10} | {data['pb']:<10} | {data['count']:<12}")

    # Call the new function to push to Firebase
    update_firebase(player_stats)